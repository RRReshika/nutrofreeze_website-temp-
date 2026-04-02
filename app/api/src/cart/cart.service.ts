import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemDto, RemoveCartItemDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(customerId: string) {
    const cart = await this.getOrCreateCart(customerId);
    return this.formatCart(await this.loadCart(cart.id));
  }

  async addItem(customerId: string, dto: AddCartItemDto) {
    const cart = await this.getOrCreateCart(customerId);
    const existingVariant = await this.prisma.variant.findUnique({ where: { id: dto.variantId } });
    if (!existingVariant) {
      throw new NotFoundException('Variant not found');
    }

    await this.prisma.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId: dto.variantId,
        },
      },
      update: {
        quantity: { increment: dto.quantity },
      },
      create: {
        cartId: cart.id,
        variantId: dto.variantId,
        quantity: dto.quantity,
      },
    });

    return this.formatCart(await this.loadCart(cart.id));
  }

  async updateItem(customerId: string, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(customerId);
    if (dto.quantity <= 0) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id, variantId: dto.variantId },
      });
      return this.formatCart(await this.loadCart(cart.id));
    }

    await this.prisma.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId: dto.variantId,
        },
      },
      update: { quantity: dto.quantity },
      create: {
        cartId: cart.id,
        variantId: dto.variantId,
        quantity: dto.quantity,
      },
    });

    return this.formatCart(await this.loadCart(cart.id));
  }

  async removeItem(customerId: string, dto: RemoveCartItemDto) {
    const cart = await this.getOrCreateCart(customerId);
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id, variantId: dto.variantId },
    });
    return this.formatCart(await this.loadCart(cart.id));
  }

  async clear(customerId: string) {
    const cart = await this.getOrCreateCart(customerId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.formatCart(await this.loadCart(cart.id));
  }

  async consumeCartItems(customerId: string) {
    const cart = await this.getOrCreateCart(customerId);
    return this.loadCart(cart.id);
  }

  private async getOrCreateCart(customerId: string) {
    return this.prisma.cart.upsert({
      where: { customerId },
      update: {},
      create: { customerId },
    });
  }

  private async loadCart(cartId: string) {
    return this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: true,
                    images: { orderBy: { sortOrder: 'asc' } },
                  },
                },
                inventory: true,
              },
            },
          },
        },
      },
    });
  }

  private formatCart(cart: Awaited<ReturnType<CartService['loadCart']>>) {
    const items = cart?.items.map((item) => {
      const product = item.variant.product;
      const image = product.images[0]?.url ?? null;
      const unitPrice = Number(item.variant.price);
      return {
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
        variant: {
          id: item.variant.id,
          title: item.variant.title,
          sku: item.variant.sku,
          price: unitPrice,
          currency: item.variant.currency,
          weightGrams: item.variant.weightGrams,
          inventory: item.variant.inventory,
        },
        product: {
          id: product.id,
          title: product.title,
          slug: product.slug,
          category: product.category,
          image,
        },
      };
    }) ?? [];

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

    return {
      id: cart?.id ?? null,
      customerId: cart?.customerId ?? null,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: Number(subtotal.toFixed(2)),
      items,
    };
  }
}
