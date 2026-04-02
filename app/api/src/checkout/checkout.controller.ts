import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  @Post('quote')
  async getQuote(@Body() dto: any) {
    return this.checkoutService.calculateQuote(dto);
  }

  @Post('payment-intent')
  async createPaymentIntent(@Body() dto: any) {
    return this.checkoutService.createPaymentIntent(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async placeOrder(@Request() req, @Body() dto: any) {
    return this.checkoutService.checkoutCustomer(req.user.userId, dto);
  }
}
