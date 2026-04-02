import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { CheckoutModule } from './checkout/checkout.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { PromotionsModule } from './promotions/promotions.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CatalogModule,
    CheckoutModule,
    OrdersModule,
    CustomersModule,
    CartModule,
    WishlistModule,
    PromotionsModule,
    LoyaltyModule,
    PaymentsModule,
    AdminModule,
  ],
})
export class AppModule {}
