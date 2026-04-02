import { Body, Controller, Delete, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddCartItemDto, UpdateCartItemDto, RemoveCartItemDto } from './cart.dto';
import { CartService } from './cart.service';

@Controller('customers/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('add')
  addItem(@Request() req, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user.userId, dto);
  }

  @Put('update')
  updateItem(@Request() req, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(req.user.userId, dto);
  }

  @Delete('remove')
  removeItem(@Request() req, @Body() dto: RemoveCartItemDto) {
    return this.cartService.removeItem(req.user.userId, dto);
  }

  @Delete()
  clear(@Request() req) {
    return this.cartService.clear(req.user.userId);
  }
}
