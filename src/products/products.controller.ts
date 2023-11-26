import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utils/guards/authorization.guard';
import { Roles } from 'src/utils/common/user-roles.enum';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import {
  SerializeIncludes,
  SerializeInterceptor,
} from 'src/utils/interceptors/serialize.interceptor';
import { ProductsDto } from './dto/products.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ProductEntity> {
    return await this.productsService.create(createProductDto, currentUser);
  }

  @ApiQuery({ name: 'limit', type: String, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'categoryId', type: String, required: false })
  @ApiQuery({ name: 'minPrice', type: String, required: false })
  @ApiQuery({ name: 'maxPrice', type: String, required: false })
  @ApiQuery({ name: 'minRating', type: String, required: false })
  @ApiQuery({ name: 'maxRating', type: String, required: false })
  @ApiQuery({ name: 'offset', type: String, required: false })
  @SerializeIncludes(ProductsDto)
  @Get()
  async findAll(
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minRating') minRating?: string,
    @Query('maxRating') maxRating?: string,
    @Query('offset') offset?: string,
  ): Promise<ProductsDto> {
    return await this.productsService.findAll(
      +limit,
      search,
      +categoryId,
      +minPrice,
      +maxPrice,
      +minRating,
      +maxRating,
      +offset,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    return await this.productsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ProductEntity> {
    return await this.productsService.update(+id, updateProductDto, currentUser);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ProductEntity> {
    return await this.productsService.remove(+id);
  }
}
