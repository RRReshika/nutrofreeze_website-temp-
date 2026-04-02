import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async listCustomerOrders(customerId: string) {
    const orders = await this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        payment: true,
        items: {
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
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: Number(order.subtotal),
      discountTotal: Number(order.discountTotal),
      taxTotal: Number(order.taxTotal),
      shippingTotal: Number(order.shippingTotal),
      total: Number(order.total),
      currency: order.currency,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
        variant: {
          id: item.variant.id,
          title: item.variant.title,
          sku: item.variant.sku,
          weightGrams: item.variant.weightGrams,
        },
        product: {
          id: item.variant.product.id,
          title: item.variant.product.title,
          slug: item.variant.product.slug,
          category: item.variant.product.category,
          image: item.variant.product.images[0]?.url ?? null,
        },
      })),
      paymentStatus: order.payment?.status ?? null,
    }));
  }
}
