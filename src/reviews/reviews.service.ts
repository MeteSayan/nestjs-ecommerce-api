import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { Roles } from 'src/utils/common/user-roles.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
    private productService: ProductsService,
  ) {}

  async create(createReviewDto: CreateReviewDto, currentUser: UserEntity): Promise<ReviewEntity> {
    const product = await this.productService.findOne(createReviewDto.productId);
    let review = await this.findOneByUserAndProduct(currentUser.id, createReviewDto.productId);
    if (!review) {
      review = this.reviewRepository.create(createReviewDto);
      review.createdBy = currentUser;
      review.product = product;
    } else {
      review.comment = createReviewDto.comment;
      review.rating = createReviewDto.rating;
    }
    return await this.reviewRepository.save(review);
  }

  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find({
      relations: {
        createdBy: true,
        product: {
          category: true,
        },
      },
    });
  }

  async findAllByProduct(id: number): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find({
      where: { product: { id: id } },
      relations: {
        createdBy: true,
        product: {
          category: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id: id },
      relations: { createdBy: true, product: { category: true } },
    });
    if (!review) throw new NotFoundException('Review Not Found!');
    return review;
  }

  async remove(id: number, currentUser: UserEntity) {
    const review = await this.findOne(id);
    if (currentUser.id === review.createdBy.id || currentUser.roles.includes[Roles.ADMIN]) {
      return this.reviewRepository.remove(review);
    } else {
      throw new UnauthorizedException('You are not authorized for this action!');
    }
  }

  async findOneByUserAndProduct(userId: number, productId: number) {
    return await this.reviewRepository.findOne({
      where: {
        createdBy: {
          id: userId,
        },
        product: {
          id: productId,
        },
      },
      relations: {
        createdBy: true,
        product: {
          category: true,
        },
      },
    });
  }
}
