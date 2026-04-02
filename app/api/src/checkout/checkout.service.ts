import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PromotionsService } from '../promotions/promotions.service';
import { CartService } from '../cart/cart.service';
import Stripe from 'stripe';

@Injectable()
export class CheckoutService {
  private stripe: Stripe;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private promotions: PromotionsService,
    private cartService: CartService,
  ) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16' as any,
    });
  }

  async calculateQuote(dto: any) {
    const { promoCode } = dto;
    const items = await this.resolveItems(dto);
    
    // Calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      subtotal += Number(item.variant.price) * item.quantity;
    }

    // Apply promotion
    let discountTotal = 0;
    if (promoCode) {
      discountTotal = await this.promotions.calculateDiscount(promoCode, subtotal);
    }

    // Fixed tax rate (7% GST for Singapore)
    const taxRate = 0.07;
    const taxableAmount = subtotal - discountTotal;
    const taxTotal = taxableAmount * taxRate;

    // Flat shipping rate (SGD 5)
    const shippingTotal = 5;

    const total = taxableAmount + taxTotal + shippingTotal;

    return {
      subtotal: subtotal.toFixed(2),
      discountTotal: discountTotal.toFixed(2),
      taxTotal: taxTotal.toFixed(2),
      shippingTotal: shippingTotal.toFixed(2),
      total: total.toFixed(2),
      currency: 'SGD',
    };
  }

  async createPaymentIntent(dto: any) {
    const items = await this.resolveItems(dto);
    const quote = await this.calculateQuote(dto);
    const amountInCents = Math.round(Number(quote.total) * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'sgd',
      automatic_payment_methods: { enabled: true },
    });

    // Create order record
    const order = await this.prisma.order.create({
      data: {
        orderNumber: `NF-${Date.now()}`,
        customerId: dto.customerId,
        guestEmail: dto.guestEmail,
        status: 'PENDING_PAYMENT',
        subtotal: Number(quote.subtotal),
        discountTotal: Number(quote.discountTotal),
        taxTotal: Number(quote.taxTotal),
        shippingTotal: Number(quote.shippingTotal),
        total: Number(quote.total),
        currency: 'SGD',
        items: {
          create: items.map((item: any) => ({
            variantId: item.variant.id,
            quantity: item.quantity,
            unitPrice: Number(item.variant.price),
            lineTotal: Number(item.variant.price) * item.quantity,
          })),
        },
      },
    });

    // Create payment record
    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: Number(quote.total),
        currency: 'SGD',
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    };
  }

  async checkoutCustomer(customerId: string, dto: any) {
    const cart = await this.cartService.consumeCartItems(customerId);
    if (!cart?.items?.length) {
      throw new BadRequestException('Cart is empty');
    }

    const items = cart.items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
      variant: item.variant,
    }));

    const subtotal = items.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);
    const discountTotal = dto.promoCode ? await this.promotions.calculateDiscount(dto.promoCode, subtotal) : 0;
    const taxTotal = (subtotal - discountTotal) * 0.07;
    const shippingTotal = 5;
    const total = subtotal - discountTotal + taxTotal + shippingTotal;

    const order = await this.prisma.order.create({
      data: {
        orderNumber: `NF-${Date.now()}`,
        customerId,
        status: 'PENDING_PAYMENT',
        subtotal,
        discountTotal,
        taxTotal,
        shippingTotal,
        total,
        currency: 'SGD',
        items: {
          create: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: Number(item.variant.price),
            lineTotal: Number(item.variant.price) * item.quantity,
          })),
        },
      },
      include: {
        items: { include: { variant: { include: { product: true } } } },
      },
    });

    await this.cartService.clear(customerId);

    return {
      ok: true,
      order,
    };
  }

  private async resolveItems(dto: any) {
    if (Array.isArray(dto.items) && dto.items.length > 0) {
      return Promise.all(
        dto.items.map(async (item: any) => {
          const variant = await this.prisma.variant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          });
          if (!variant) {
            throw new Error(`Variant not found: ${item.variantId}`);
          }
          return { quantity: item.quantity, variant };
        }),
      );
    }

    if (dto.customerId) {
      const cart = await this.cartService.consumeCartItems(dto.customerId);
      return cart.items.map((item) => ({ quantity: item.quantity, variant: item.variant }));
    }

    throw new BadRequestException('No items supplied for checkout');
  }
}
