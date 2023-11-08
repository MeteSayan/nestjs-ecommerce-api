import { BadRequestException, Injectable } from '@nestjs/common';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const isExist = await this.userRepository.findOneBy({
      email: userSignUpDto.email,
    });

    if (isExist) throw new BadRequestException('This email is already in use.');

    userSignUpDto.password = await hash(userSignUpDto.password, 10);
    const user = await this.userRepository.save(userSignUpDto);
    delete user.password;
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
