import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';

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
    return await this.reviewRepository.find();
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

  remove(id: number) {
    return `This action removes a #${id} review`;
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
