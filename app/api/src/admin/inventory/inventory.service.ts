import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async listInventory(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.inventory.findMany({
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  category: true,
                  images: { orderBy: { sortOrder: 'asc' } },
                },
              },
            },
          },
        },
      }),
      this.prisma.inventory.count(),
    ]);

    return {
      items: items.map((item) => this.formatInventoryItem(item)),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async updateInventory(variantId: string, onHand: number) {
    const variant = await this.prisma.variant.findUnique({ where: { id: variantId } });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const inventory = await this.prisma.inventory.upsert({
      where: { variantId },
      create: {
        variantId,
        onHand,
        reserved: 0,
      },
      update: {
        onHand,
      },
      include: {
        variant: {
          include: {
            product: {
              include: {
                category: true,
                images: { orderBy: { sortOrder: 'asc' } },
              },
            },
          },
        },
      },
    });

    return this.formatInventoryItem(inventory);
  }

  private formatInventoryItem(item: any) {
    return {
      variantId: item.variantId,
      onHand: item.onHand,
      reserved: item.reserved,
      updatedAt: item.updatedAt,
      lowStock: item.onHand <= 10,
      variant: {
        id: item.variant.id,
        title: item.variant.title,
        sku: item.variant.sku,
        price: Number(item.variant.price),
        currency: item.variant.currency,
        weightGrams: item.variant.weightGrams,
      },
      product: {
        id: item.variant.product.id,
        title: item.variant.product.title,
        slug: item.variant.product.slug,
        category: item.variant.product.category,
        image: item.variant.product.images[0]?.url ?? null,
      },
    };
  }
}
