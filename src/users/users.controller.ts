import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-sign-in.dto';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeRoles } from 'src/utils/decorators/authorize-roles.decorator';
import { Roles } from 'src/utils/common/user-roles.enum';
import { AuthorizationGuard } from 'src/utils/guards/authorization.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.usersService.findOne(+id);
  }

  @Post('signup')
  async signUp(@Body() userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    return await this.usersService.signUp(userSignUpDto);
  }

  @Post('signin')
  async signin(@Body() userSignInDto: UserSignInDto): Promise<{
    accessToken: string;
    user: UserEntity;
  }> {
    const user = await this.usersService.signIn(userSignInDto);
    const accessToken = await this.usersService.accessToken(user);

    return { accessToken, user };
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
