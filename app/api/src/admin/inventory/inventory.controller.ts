import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { AdminJwtGuard } from '../guards/admin-jwt.guard';
import { AdminPermissionsGuard } from '../guards/admin-permissions.guard';
import { AdminPermissions, AdminRoles } from '../decorators/admin-access.decorator';
import { InventoryService } from './inventory.service';

class UpdateInventoryDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  onHand: number;
}

@Controller('admin/inventory')
@UseGuards(AdminJwtGuard, AdminPermissionsGuard)
@AdminRoles('OWNER', 'ADMIN', 'OPS')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  @AdminPermissions('inventory:read')
  listInventory(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.inventoryService.listInventory(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 50);
  }

  @Put(':variantId')
  @AdminPermissions('inventory:update')
  updateInventory(@Param('variantId') variantId: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.updateInventory(variantId, dto.onHand);
  }
}
