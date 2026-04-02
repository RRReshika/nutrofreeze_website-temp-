import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from '../guards/admin-jwt.guard';
import { AdminPermissionsGuard } from '../guards/admin-permissions.guard';
import { AdminPermissions, AdminRoles } from '../decorators/admin-access.decorator';
import { AdminOrdersService } from './admin-orders.service';
import { UpdateOrderStatusDto } from './admin-orders.dto';

@Controller('admin/orders')
@UseGuards(AdminJwtGuard, AdminPermissionsGuard)
@AdminRoles('OWNER', 'ADMIN', 'OPS', 'SUPPORT')
export class AdminOrdersController {
  constructor(private ordersService: AdminOrdersService) {}

  @Get()
  @AdminPermissions('order:read')
  listOrders(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.ordersService.listOrders(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
  }

  @Put(':id/status')
  @AdminPermissions('order:update_status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
