import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as config from 'config';
import { DataSource, DataSourceOptions } from 'typeorm';

const username = config.get('dbConfig.dbUser') as string;
const password = config.get('dbConfig.dbPass') as string;
const dbName = config.get('dbConfig.dbName') as string;
const dbHost = config.get('dbConfig.dbHost') as string;
const dbPort = config.get('dbConfig.dbPort') as number;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: dbHost,
  port: dbPort,
  username: username,
  password: password,
  database: dbName,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
