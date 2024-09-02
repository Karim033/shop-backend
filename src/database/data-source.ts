import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as dotenvEpand from 'dotenv-expand';

dotenvEpand.expand(dotenv.config());
export default new DataSource({
  type: 'postgres',
  url: process.env.DATASOURCE_URL,
  entities: ['dist/domain/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
});
