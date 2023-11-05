import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const username = config.get('dbConfig.dbUser') as string;
const password = config.get('dbConfig.dbPass') as string;
const dbName = config.get('dbConfig.dbName') as string;
const dbHost = config.get('dbConfig.dbHost') as string;
const dbPort = config.get('dbConfig.dbPort') as number;

export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: dbHost,
  port: dbPort,
  username: username,
  password: password,
  database: dbName,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  keepConnectionAlive: true,
};
