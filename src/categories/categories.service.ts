import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    currentUser: UserEntity,
  ): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(createCategoryDto);
    category.createdBy = currentUser;
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<CategoryEntity> {
    return await this.categoryRepository.findOne({
      where: { id: id },
      relations: { createdBy: true },
      select: {
        createdBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }

  async update(id: number, updateCategoryDto: Partial<UpdateCategoryDto>): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category Not Found!');
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  // async remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
