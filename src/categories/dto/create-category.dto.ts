import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
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
}
