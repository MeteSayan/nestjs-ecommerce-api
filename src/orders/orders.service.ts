import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { Roles } from 'src/utils/common/user-roles.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersProductsEntity)
    private ordersProductsRepository: Repository<OrdersProductsEntity>,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity): Promise<OrderEntity> {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.createdBy = currentUser;

    const orderReturn = await this.ordersRepository.save(orderEntity);

    let opEntity: {
      order: OrderEntity;
      product: ProductEntity;
      productQuantity: number;
      productUnitPrice: number;
    }[] = [];

    for (let x = 0; x < createOrderDto.orderedProducts.length; x++) {
      const order = orderReturn;
      const product = await this.productsService.findOne(createOrderDto.orderedProducts[x].id);
      const productQuantity = createOrderDto.orderedProducts[x].productQuantity;
      const productUnitPrice = createOrderDto.orderedProducts[x].productUnitPrice;
      opEntity.push({ order, product, productQuantity, productUnitPrice });
    }

    const ordersProducts = await this.ordersProductsRepository
      .createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(opEntity)
      .execute();

    return await this.findOne(orderReturn.id, currentUser);
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.ordersRepository.find({
      relations: {
        shippingAddress: true,
        createdBy: true,
        products: { product: true },
      },
    });
  }

  async findAllByUserId(currentUser: UserEntity): Promise<OrderEntity[]> {
    return await this.ordersRepository.find({
      where: {
        createdBy: {
          id: currentUser.id,
        },
      },
      relations: {
        shippingAddress: true,
        createdBy: true,
        products: { product: true },
      },
    });
  }

  async findOne(id: number, currentUser: UserEntity): Promise<OrderEntity> {
    let order;
    if (currentUser.roles.includes(Roles.ADMIN)) {
      order = await this.ordersRepository.findOne({
        where: { id: id },
        relations: {
          shippingAddress: true,
          createdBy: true,
          products: { product: true },
        },
      });
    } else {
      order = await this.ordersRepository.findOne({
        where: {
          id: id,
          createdBy: {
            id: currentUser.id,
          },
        },
        relations: {
          shippingAddress: true,
          createdBy: true,
          products: { product: true },
        },
      });
    }

    if (!order) throw new NotFoundException('Order Not Found!');
    return order;
  }

  async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto, currentUser: UserEntity) {
    let order = await this.findOne(id, currentUser);
    if (!order) throw new NotFoundException('Order Not Found!');

    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELED) {
      throw new BadRequestException(`Order already ${order.status}`);
    }

    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderStatusDto.status !== OrderStatus.SHIPPED
    ) {
      throw new BadRequestException(`Delivery before shipping is not possible!`);
    }

    if (
      updateOrderStatusDto.status === OrderStatus.SHIPPED &&
      order.status === OrderStatus.SHIPPED
    ) {
      return order;
    }

    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.ordersRepository.save(order);
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.updateStock(order, OrderStatus.DELIVERED);
    }
    return order;
  }

  async cancelOrder(id: number, currentUser: UserEntity) {
    let order = await this.findOne(id, currentUser);
    if (!order) throw new NotFoundException('Order Not Found!');

    if (order.status === OrderStatus.CANCELED) return order;

    order.status = OrderStatus.CANCELED;
    order.updatedBy = currentUser;
    order = await this.ordersRepository.save(order);

    await this.updateStock(order, OrderStatus.CANCELED);
    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async updateStock(order: OrderEntity, status: string) {
    for (const op of order.products) {
      await this.productsService.updateStock(op.product.id, op.productQuantity, status);
    }
  }
}
