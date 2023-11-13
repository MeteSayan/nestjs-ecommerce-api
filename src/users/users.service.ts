import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { UserSignInDto } from './dto/user-sign-in.dto';
import { sign } from 'jsonwebtoken';
import * as config from 'config';
import { UpdatePasswordDto } from './dto/update-password.dto';

const jwtSecretKey = config.get('JWTConfig.secretKey') as string;
const jwtExpireTime = config.get('JWTConfig.expireTime') as string;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.userRepository.findOneBy({
      email: userSignUpDto.email,
    });

    if (userExists) throw new BadRequestException('This email is already in use.');

    userSignUpDto.password = await hash(userSignUpDto.password, 10);
    const user = await this.userRepository.save(userSignUpDto);
    delete user.password;
    return user;
  }

  async signIn(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const userExists = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userSignInDto.email })
      .getOne();

    if (!userExists) throw new BadRequestException('Wrong Creadentials.');
    const matchPassword = await compare(userSignInDto.password, userExists.password);
    if (!matchPassword) throw new BadRequestException('Wrong Creadentials.');

    delete userExists.password;
    return userExists;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const userExists = await this.userRepository.findOneBy({
      id: id,
    });
    if (!userExists) throw new NotFoundException('User Not Found!');
    return userExists;
  }

  async updateMe(currentUser: UserEntity, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id: currentUser.id });

    user.name = updateUserDto.name;
    user.email = updateUserDto.email;

    return await this.userRepository.save(user);
  }

  async updateMePassword(currentUser: UserEntity, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.findOneBy({ id: currentUser.id });
    user.password = await hash(updatePasswordDto.password, 10);

    return await this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) throw new NotFoundException('User Not Found!');

    user.name = updateUserDto.name;
    user.email = updateUserDto.email;

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const userExists = await this.userRepository.findOneBy({ id: id });
    if (!userExists) throw new NotFoundException('User Not Found!');

    return this.userRepository.remove(userExists);
  }

  async accessToken(user: UserEntity): Promise<string> {
    return sign(
      {
        id: user.id,
        email: user.email,
      },
      jwtSecretKey,
      {
        expiresIn: jwtExpireTime,
      },
    );
  }
}
