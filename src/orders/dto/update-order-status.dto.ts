import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @IsNotEmpty({ message: 'Status can not be empty!' })
  @IsString({ message: 'Status must be String!' })
  @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED])
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  status: OrderStatus;
}
