import { Type } from 'class-transformer';
import { CreateShippingDto } from './create-shipping.dto';
import { ValidateNested } from 'class-validator';
import { OrderedProductsDto } from './ordered-products.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @Type(() => CreateShippingDto)
  @ValidateNested()
  @ApiProperty({
    type: CreateShippingDto,
    description: 'This is a required property',
  })
  shippingAddress: CreateShippingDto;

  @Type(() => OrderedProductsDto)
  @ValidateNested()
  @ApiProperty({
    type: OrderedProductsDto,
    description: 'This is a required property',
    isArray: true,
  })
  orderedProducts: OrderedProductsDto[];
}
