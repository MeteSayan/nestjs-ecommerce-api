import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Title can not be empty!' })
  @MinLength(3, { message: 'Minimum title length must be 3.' })
  @IsString({ message: 'Title must be String!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  title: string;

  @IsNotEmpty({ message: 'Description can not be empty!' })
  @MinLength(5, { message: 'Minimum description length must be 5.' })
  @IsString({ message: 'Description must be String!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  description: string;

  @IsNotEmpty({ message: 'Price can not be empty!' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 },
    { message: 'Price must be Number & max decimal must be 2!' },
  )
  @IsPositive({ message: 'Price must be positive number!' })
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  price: number;

  @IsNotEmpty({ message: 'Stock can not be empty!' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'Stock must be Number!' },
  )
  @Min(0, { message: 'Stock can not be negative!' })
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  stock: number;

  @IsNotEmpty({ each: true, message: 'Images can not be empty!' })
  @IsArray({ message: 'Images must be Array!' })
  @IsString({ each: true, message: 'Images must be String array!' })
  @ApiProperty({
    type: Array<String>,
    description: 'This is a required property',
  })
  images: string[];

  @IsNotEmpty({ message: 'Category can not be empty!' })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'Category can not be negative!' })
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  category: number;
}
