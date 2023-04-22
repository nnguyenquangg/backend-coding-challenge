import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envConfig } from './env.config';

export const ormConfig = TypeOrmModule.forRoot({
  type: envConfig.DATABASE.TYPE,
  host: envConfig.DATABASE.HOST,
  port: envConfig.DATABASE.PORT,
  username: envConfig.DATABASE.USERNAME,
  password: envConfig.DATABASE.PASSWORD,
  database: envConfig.DATABASE.NAME,
  synchronize: false,
  migrationsRun: true,
  logging: false,
  entities: [`${envConfig.ROOT_PATH}/**/*.entity.${envConfig.IS_TEST ? 'ts' : 'js'}`],
  migrations: [
    `${envConfig.ROOT_PATH}/dist/migrations/*.js`,
    `${envConfig.ROOT_PATH}/**/databases/migrations/*.${envConfig.IS_TEST ? 'ts' : 'js'}`,
  ],
  cli: {
    migrationsDir: [`${envConfig.ROOT_PATH}/**/databases/migrations/*.${envConfig.IS_TEST ? 'ts' : 'js'}`],
  },
} as unknown as TypeOrmModuleOptions);
