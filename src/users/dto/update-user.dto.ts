import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Email can not be empty!' })
  @IsEmail({}, { message: 'Please provide a valid email!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  email: string;

  @IsNotEmpty({ message: 'Name can not be empty!' })
  @IsString({ message: 'Name must be String!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  name: string;
}
