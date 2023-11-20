import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product Id can not be empty!' })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @Min(0, { message: 'Product Id can not be negative!' })
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  productId: number;

  @IsNotEmpty({ message: 'Rating can not be empty!' })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @IsPositive({ message: 'Rating must be positive number!' })
  @Max(5, { message: 'Rating can not be more than 5!' })
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  rating: number;

  @IsNotEmpty({ message: 'Comment can not be empty!' })
  @MinLength(5, { message: 'Minimum comment length must be 5.' })
  @IsString({ message: 'Comment must be String!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  comment: string;
}
