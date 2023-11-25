import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { AuthorizationGuard } from 'src/utils/guards/authorization.guard';
import { Roles } from 'src/utils/common/user-roles.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<OrderEntity> {
    return await this.ordersService.create(createOrderDto, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @ApiBearerAuth()
  @Get()
  async findAll(): Promise<OrderEntity[]> {
    return await this.ordersService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get('user')
  async findAllByUserId(@CurrentUser() currentUser: UserEntity): Promise<OrderEntity[]> {
    return await this.ordersService.findAllByUserId(currentUser);
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<OrderEntity> {
    return await this.ordersService.findOne(+id, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return await this.ordersService.update(+id, updateOrderStatusDto, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Put('cancel/:id')
  async cancelOrder(@Param('id') id: string, @CurrentUser() currentUser: UserEntity) {
    return await this.ordersService.cancelOrder(+id, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
