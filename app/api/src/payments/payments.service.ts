import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16' as any,
    });
  }

  async handleStripeWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
    
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret || '');
    } catch (err: any) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    // Idempotency check
    const existing = await this.prisma.stripeEvent.findUnique({
      where: { stripeEventId: event.id },
    });
    
    if (existing) {
      return { received: true, alreadyProcessed: true };
    }

    // Record event
    await this.prisma.stripeEvent.create({
      data: {
        stripeEventId: event.id,
        eventType: event.type,
      },
    });

    // Handle payment success
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      const payment = await this.prisma.payment.findUnique({
        where: { stripePaymentIntentId: paymentIntent.id },
      });

      if (payment) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCEEDED', paidAt: new Date() },
        });

        const order = await this.prisma.order.update({
          where: { id: payment.orderId },
          data: { status: 'PAID' },
        });

        // Award loyalty points (1 point per SGD) if order belongs to a customer
        if (order.customerId) {
          const points = Math.floor(Number(order.total));
          if (points > 0) {
            await this.prisma.loyaltyAccount.upsert({
              where: { customerId: order.customerId },
              create: { customerId: order.customerId, pointsBalance: points },
              update: { pointsBalance: { increment: points } },
            });
            await this.prisma.loyaltyLedger.create({
              data: {
                customerId: order.customerId,
                pointsDelta: points,
                reason: `Order ${order.orderNumber} — earned ${points} pts`,
                orderId: order.id,
              },
            });
          }
        }
      }
    }

    // Handle payment failure
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      const payment = await this.prisma.payment.findUnique({
        where: { stripePaymentIntentId: paymentIntent.id },
      });

      if (payment) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' },
        });
      }
    }

    return { received: true };
  }
}
