import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminSecurityModule } from './admin-security.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductModule } from './products/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { AdminOrdersModule } from './orders/admin-orders.module';

@Module({
  imports: [PrismaModule, AdminSecurityModule, ProductModule, InventoryModule, AdminOrdersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
