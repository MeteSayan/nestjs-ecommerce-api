import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
  ) {}

  create(createReviewDto: CreateReviewDto) {
    return 'This action adds a new review';
  }

  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find();
  }

  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id: id },
      relations: { createdBy: true, product: { category: true } },
    });
    if (!review) throw new NotFoundException('Review Not Found!');
    return review;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
