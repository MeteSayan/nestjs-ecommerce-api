import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class OrderedProductsDto {
  @IsNotEmpty({ message: 'Id can not be empty!' })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Id must be Number!' })
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  id: number;

  @IsNotEmpty({ message: 'Price can not be empty!' })
  @IsPositive({ message: 'Price can not be Negative!' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be Number!' })
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  productUnitPrice: number;

  @IsNotEmpty({ message: 'Quantity can not be empty!' })
  @IsPositive({ message: 'Quantity can not be Negative!' })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Quantity must be Number!' })
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  productQuantity: number;
}
