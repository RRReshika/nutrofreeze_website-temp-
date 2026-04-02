import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async calculateDiscount(code: string, subtotal: number): Promise<number> {
    const promo = await this.prisma.promotion.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo || !promo.isActive) {
      throw new BadRequestException('Invalid promo code');
    }

    if (promo.startAt > new Date()) {
      throw new BadRequestException('Promo code not yet active');
    }

    if (promo.endAt && promo.endAt < new Date()) {
      throw new BadRequestException('Promo code expired');
    }

    if (promo.minSpend && subtotal < Number(promo.minSpend)) {
      throw new BadRequestException(`Minimum spend of SGD ${promo.minSpend} required`);
    }

    if (promo.type === 'FREE_SHIPPING') {
      return 5; // Flat shipping rate
    }

    if (promo.type === 'FIXED') {
      return Math.min(Number(promo.value), subtotal);
    }

    if (promo.type === 'PERCENT') {
      const discount = subtotal * (Number(promo.value) / 100);
      if (promo.maxDiscountAmount) {
        return Math.min(discount, Number(promo.maxDiscountAmount));
      }
      return discount;
    }

    return 0;
  }
}
