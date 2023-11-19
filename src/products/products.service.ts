import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private categoriesService: CategoriesService,
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

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
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

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
