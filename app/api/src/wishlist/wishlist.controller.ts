import { Body, Controller, Delete, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddWishlistItemDto, RemoveWishlistItemDto } from './wishlist.dto';
import { WishlistService } from './wishlist.service';

@Controller('customers/wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.userId);
  }

  @Post('add')
  addItem(@Request() req, @Body() dto: AddWishlistItemDto) {
    return this.wishlistService.addItem(req.user.userId, dto);
  }

  @Delete('remove')
  removeItem(@Request() req, @Body() dto: RemoveWishlistItemDto) {
    return this.wishlistService.removeItem(req.user.userId, dto);
  }
}
