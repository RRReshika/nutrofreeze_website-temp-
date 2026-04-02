import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';

const DEFAULT_CURRENCY = 'SGD';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[()\/]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async listProducts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          variants: { include: { inventory: true } },
          images: { orderBy: { sortOrder: 'asc' } },
        },
      }),
      this.prisma.product.count(),
    ]);

    return {
      products: products.map((product) => this.formatProduct(product)),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: { include: { inventory: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.formatProduct(product);
  }

  async createProduct(data: CreateProductDto) {
    const slug = data.slug || slugify(data.title);
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException('Product slug already exists');
    }

    const product = await this.prisma.product.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        formFactor: data.formFactor,
        categoryId: data.categoryId,
        status: data.status || ProductStatus.ACTIVE,
        variants: {
          create: {
            title: data.variant.title,
            sku: data.variant.sku,
            price: data.variant.price,
            currency: data.variant.currency || DEFAULT_CURRENCY,
            weightGrams: data.variant.weightGrams ?? null,
            inventory: {
              create: {
                onHand: data.variant.onHand ?? 0,
                reserved: 0,
              },
            },
          },
        },
        images: data.images?.length
          ? {
              create: data.images.map((image, index) => ({
                url: image.url,
                alt: image.alt,
                sortOrder: image.sortOrder ?? index,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        variants: { include: { inventory: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    return this.formatProduct(product);
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: { include: { inventory: true } } },
    });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    const nextSlug = data.slug || (data.title ? slugify(data.title) : existing.slug);
    if (nextSlug !== existing.slug) {
      const slugExists = await this.prisma.product.findUnique({ where: { slug: nextSlug } });
      if (slugExists) {
        throw new ConflictException('Product slug already exists');
      }
    }

    const primaryVariant = existing.variants[0];

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          title: data.title,
          slug: nextSlug,
          description: data.description,
          formFactor: data.formFactor,
          categoryId: data.categoryId,
          status: data.status,
        },
      });

      if (data.variant && primaryVariant) {
        await tx.variant.update({
          where: { id: primaryVariant.id },
          data: {
            title: data.variant.title,
            sku: data.variant.sku,
            price: data.variant.price,
            currency: data.variant.currency || DEFAULT_CURRENCY,
            weightGrams: data.variant.weightGrams ?? null,
          },
        });

        if (typeof data.variant.onHand === 'number') {
          await tx.inventory.upsert({
            where: { variantId: primaryVariant.id },
            create: {
              variantId: primaryVariant.id,
              onHand: data.variant.onHand,
              reserved: 0,
            },
            update: {
              onHand: data.variant.onHand,
            },
          });
        }
      }

      if (data.images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (data.images.length) {
          await tx.productImage.createMany({
            data: data.images.map((image, index) => ({
              productId: id,
              url: image.url,
              alt: image.alt,
              sortOrder: image.sortOrder ?? index,
            })),
          });
        }
      }

      return tx.product.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
          variants: { include: { inventory: true } },
          images: { orderBy: { sortOrder: 'asc' } },
        },
      });
    });

    return this.formatProduct(updated);
  }

  async deleteProduct(id: string) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: { include: { orderItems: true } } },
    });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    const hasOrderItems = existing.variants.some((variant) => variant.orderItems.length > 0);
    if (hasOrderItems) {
      throw new ConflictException('Product has order history and cannot be deleted');
    }

    await this.prisma.product.delete({ where: { id } });
    return { ok: true };
  }

  private formatProduct(product: any) {
    const variants = product.variants ?? [];
    const primaryVariant = variants[0] ?? null;

    return {
      id: product.id,
      slug: product.slug,
      title: product.title,
      description: product.description,
      formFactor: product.formFactor,
      status: product.status,
      category: product.category,
      images: product.images,
      variants: variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        price: Number(variant.price),
        currency: variant.currency,
        weightGrams: variant.weightGrams,
        inventory: variant.inventory,
      })),
      primaryVariant: primaryVariant
        ? {
            id: primaryVariant.id,
            title: primaryVariant.title,
            sku: primaryVariant.sku,
            price: Number(primaryVariant.price),
            currency: primaryVariant.currency,
            weightGrams: primaryVariant.weightGrams,
            inventory: primaryVariant.inventory,
          }
        : null,
    };
  }
}
