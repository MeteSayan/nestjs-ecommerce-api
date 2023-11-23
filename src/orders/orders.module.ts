import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { OrdersProductsEntity } from './entities/orders-products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, ShippingEntity, OrdersProductsEntity])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
