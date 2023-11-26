import { Expose, Type, Transform } from 'class-transformer';
import { Timestamp } from 'typeorm';

export class ProductsDto {
  @Expose()
  totalProducts: number;

  @Expose()
  limit: number;

  @Expose()
  offset: number;

  @Expose()
  @Type(() => ProductList)
  products: ProductList[];
}

export class ProductList {
  @Expose({ name: 'product_id' })
  id: number;

  @Expose({ name: 'product_title' })
  title: string;

  @Expose({ name: 'product_description' })
  description: string;

  @Expose({ name: 'product_price' })
  price: number;

  @Expose({ name: 'product_stock' })
  stock: number;

  @Expose({ name: 'product_images' })
  @Transform(({ value }) => value.toString().split(','))
  images: string[];

  @Expose()
  @Transform(({ obj }) => {
    return {
      id: obj.category_id,
      title: obj.category_title,
      description: obj.category_description,
    };
  })
  category: { id: number; title: string; description: string };

  @Expose({ name: 'reviewcount' })
  review: number;

  @Expose({ name: 'avgrating' })
  rating: number;
}
