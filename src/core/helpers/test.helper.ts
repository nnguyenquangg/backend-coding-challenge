import { HttpServer, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import * as supertest from 'supertest';
import { getConnection } from 'typeorm';
import { AppModule } from '~app.module';
import { envConfig } from '~config/env.config';
import { ormConfig } from '~config/orm.config';

export class TestHelper {
  public app: INestApplication;
  public httpService: HttpServer;
  public request: supertest.SuperTest<supertest.Test>;
  private pool: Pool;

  async initialize() {
    await this.createDatabase();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ormConfig],
    }).compile();
    if (!getConnection().isConnected) {
      await getConnection().connect();
    }

    this.app = moduleFixture.createNestApplication();
    this.app.useGlobalPipes(new ValidationPipe());
    await this.app.init();
    this.request = supertest(this.app.getHttpServer());
  }

  async createDatabase() {
    this.pool = new Pool({
      user: envConfig.DATABASE.USERNAME,
      host: envConfig.DATABASE.HOST,
      password: envConfig.DATABASE.PASSWORD,
      port: envConfig.DATABASE.PORT,
      database: envConfig.DATABASE.TYPE,
    });
    await this.pool.query(`CREATE DATABASE "${envConfig.DATABASE.NAME}"`);
  }

  async close(): Promise<void> {
    this.app.flushLogs();
    await this.app.close();
    this.app = null;
    await this.removeAndCloseDatabaseConnection();
  }

  async removeAndCloseDatabaseConnection() {
    await this.pool.query(`DROP DATABASE "${envConfig.DATABASE.NAME}"`);
    await this.pool.end();
    if (getConnection().isConnected) {
      await getConnection().close();
    }
  }

  async getAdminAccessToken(): Promise<string> {
    const { body } = await this.request
      .post('/auth/sign-in')
      .send({
        email: envConfig.DEFAULT_ADMIN.EMAIL,
        password: envConfig.DEFAULT_ADMIN.PASSWORD,
      })
      .expect(HttpStatus.OK);

    return body.accessToken;
  }
}
