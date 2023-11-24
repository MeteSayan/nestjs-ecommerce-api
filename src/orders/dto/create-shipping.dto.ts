import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty({ message: 'Phone can not be empty!' })
  @IsString({ message: 'Phone must be String!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  phone: string;

  @IsNotEmpty({ message: 'Name can not be empty!' })
  @IsString({ message: 'Name must be String!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  name: string;

  @IsNotEmpty({ message: 'Address can not be empty!' })
  @IsString({ message: 'Address must be String!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  address: string;

  @IsNotEmpty({ message: 'City can not be empty!' })
  @IsString({ message: 'City must be String!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  city: string;

  @IsNotEmpty({ message: 'Post Code can not be empty!' })
  @IsString({ message: 'Post Code must be String!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  postCode: string;

  @IsNotEmpty({ message: 'State can not be empty!' })
  @IsString({ message: 'State must be String!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  state: string;

  @IsNotEmpty({ message: 'Country can not be empty!' })
  @IsString({ message: 'Country must be String!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  country: string;
}
