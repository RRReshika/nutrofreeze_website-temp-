import { IsInt, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  variantId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsString()
  variantId: string;

  @IsInt()
  @Min(0)
  quantity: number;
}

export class RemoveCartItemDto {
  @IsString()
  variantId: string;
}
