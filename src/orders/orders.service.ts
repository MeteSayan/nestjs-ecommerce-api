import { Injectable } from '@nestjs/common';
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

    return await this.findOne(orderReturn.id);
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

  async findOne(id: number): Promise<OrderEntity> {
    return await this.ordersRepository.findOne({
      where: { id: id },
      relations: {
        shippingAddress: true,
        createdBy: true,
        products: { product: true },
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
