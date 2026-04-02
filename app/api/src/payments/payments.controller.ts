import { Controller, Post, Headers, RawBody } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('webhooks')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('stripe')
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @RawBody() payload: Buffer,
  ) {
    return this.paymentsService.handleStripeWebhook(signature, payload);
  }
}
