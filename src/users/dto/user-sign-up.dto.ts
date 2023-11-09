import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserSignInDto } from './user-sign-in.dto';

export class UserSignUpDto extends UserSignInDto {
  @IsNotEmpty({ message: 'Name can not be empty!' })
  @IsString({ message: 'Name must be String!' })
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  name: string;
}
