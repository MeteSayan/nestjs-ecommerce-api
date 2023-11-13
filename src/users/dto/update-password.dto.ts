import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'Password can not be empty!' })
  @IsString({ message: 'Password must be String!' })
  @MinLength(8, { message: 'Minimum password length must be 8.' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  password: string;
}
