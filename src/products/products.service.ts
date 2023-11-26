import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import dataSource from 'db/data-source';
import { ProductsDto } from './dto/products.dto';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private categoriesService: CategoriesService,
    @Inject(forwardRef(() => OrdersService))
    private orderService: OrdersService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const category = await this.categoriesService.findOne(+createProductDto.categoryId);
    const product = this.productRepository.create(createProductDto);
    product.category = category;
    product.createdBy = currentUser;

    return await this.productRepository.save(product);
  }

  async findAll(
    limit?: number,
    search?: string,
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
    maxRating?: number,
    offset?: number,
  ): Promise<ProductsDto> {
    if (!limit) limit = 4;

    const queryBuilder = dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoin('product.reviews', 'review')
      .addSelect([
        'COUNT(review.id) AS reviewCount',
        'AVG(review.rating)::numeric(10,2) AS avgRating',
      ])
      .groupBy('product.id, category.id');

    const totalProducts = await queryBuilder.getCount();

    if (search) {
      queryBuilder.andWhere('product.title like :title', { title: `%${search}%` });
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id=:id', { id: categoryId });
    }

    if (minPrice) {
      queryBuilder.andWhere('product.price>=:minPrice', { minPrice: minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('product.price<=:maxPrice', { maxPrice: maxPrice });
    }

    if (minRating) {
      queryBuilder.andWhere('review.rating>=:minRating', { minRating: minRating });
    }

    if (maxRating) {
      queryBuilder.andWhere('review.rating<=:maxRating', { maxRating: maxRating });
    }

    queryBuilder.limit(limit);

    if (offset) {
      queryBuilder.offset(offset);
    }

    const products = await queryBuilder.getRawMany();

    return { products, totalProducts, limit, offset: offset || 0 };
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: { createdBy: true, category: true },
      select: {
        createdBy: {
          id: true,
          name: true,
          email: true,
        },
        category: {
          id: true,
          title: true,
          description: true,
        },
      },
    });

    if (!product) throw new NotFoundException('Product Not Found!');
    return product;
  }

  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    product.createdBy = currentUser;

    if (updateProductDto.categoryId) {
      const category = await this.categoriesService.findOne(+updateProductDto.categoryId);
      product.category = category;
    }

    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<ProductEntity> {
    const product = await this.findOne(id);
    const order = await this.orderService.findOneByProductId(product.id);
    if (order) throw new BadRequestException('Products is in use.');

    return await this.productRepository.remove(product);
  }

  async updateStock(id: number, productQuantity: number, status: string) {
    let product = await this.findOne(id);
    if (status === OrderStatus.DELIVERED) {
      product.stock -= productQuantity;
    } else {
      product.stock += productQuantity;
    }

    product = await this.productRepository.save(product);
    return product;
  }
}
