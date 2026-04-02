import { Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @Type(() => String)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
