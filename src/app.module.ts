import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from '../db/typeorm-options';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
