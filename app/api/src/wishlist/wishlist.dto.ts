import { IsString } from 'class-validator';

export class AddWishlistItemDto {
  @IsString()
  productId: string;
}

export class RemoveWishlistItemDto {
  @IsString()
  productId: string;
}
