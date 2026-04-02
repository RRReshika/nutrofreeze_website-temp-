import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddWishlistItemDto, RemoveWishlistItemDto } from './wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(customerId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          include: {
            category: true,
            images: { orderBy: { sortOrder: 'asc' } },
            variants: { include: { inventory: true } },
          },
        },
      },
    });

    return {
      items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        createdAt: item.createdAt,
        product: item.product,
      })),
      itemCount: items.length,
    };
  }

  async addItem(customerId: string, dto: AddWishlistItemDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.wishlistItem.upsert({
      where: {
        customerId_productId: {
          customerId,
          productId: dto.productId,
        },
      },
      update: {},
      create: {
        customerId,
        productId: dto.productId,
      },
    });

    return this.getWishlist(customerId);
  }

  async removeItem(customerId: string, dto: RemoveWishlistItemDto) {
    await this.prisma.wishlistItem.deleteMany({
      where: { customerId, productId: dto.productId },
    });
    return this.getWishlist(customerId);
  }
}
