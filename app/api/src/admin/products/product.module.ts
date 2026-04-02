import { Module } from '@nestjs/common';
import { AdminSecurityModule } from '../admin-security.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [AdminSecurityModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
