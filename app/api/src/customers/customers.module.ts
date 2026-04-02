import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CartModule } from '../cart/cart.module';
import { WishlistModule } from '../wishlist/wishlist.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
	imports: [AuthModule, CartModule, WishlistModule, OrdersModule],
	exports: [AuthModule, CartModule, WishlistModule, OrdersModule],
})
export class CustomersModule {}
