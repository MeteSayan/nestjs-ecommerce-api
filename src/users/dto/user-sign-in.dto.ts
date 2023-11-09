import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserSignInDto {
  @IsNotEmpty({ message: 'Email can not be empty!' })
  @IsEmail({}, { message: 'Please provide a valid email!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  email: string;

  @IsNotEmpty({ message: 'Password can not be empty!' })
  @IsString({ message: 'Password must be String!' })
  @MinLength(8, { message: 'Minimum password length must be 8.' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  password: string;
}
