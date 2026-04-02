import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from '../guards/admin-jwt.guard';
import { AdminPermissionsGuard } from '../guards/admin-permissions.guard';
import { AdminPermissions, AdminRoles } from '../decorators/admin-access.decorator';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('admin/products')
@UseGuards(AdminJwtGuard, AdminPermissionsGuard)
@AdminRoles('OWNER', 'ADMIN')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @AdminPermissions('product:read')
  listProducts(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.productService.listProducts(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
  }

  @Get(':id')
  @AdminPermissions('product:read')
  getProduct(@Param('id') id: string) {
    return this.productService.getProduct(id);
  }

  @Post()
  @AdminPermissions('product:create')
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Put(':id')
  @AdminPermissions('product:update')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(id, dto);
  }

  @Delete(':id')
  @AdminPermissions('product:delete')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
