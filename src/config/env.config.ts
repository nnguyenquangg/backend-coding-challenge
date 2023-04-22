import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();
const isTest = process.env.NODE_ENV === 'test';

export const envConfig = {
  ROOT_PATH: process.cwd() + (isTest ? '/src' : ''),
  IS_TEST: isTest,
  DATABASE: {
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME + (isTest ? `_${randomUUID({ disableEntropyCache: true }).replace(/-/g, '')}` : ''),
    PORT: Number(process.env.DB_PORT) || 5432,
    HOST: process.env.DB_HOST,
    TYPE: process.env.DB_TYPE || 'postgres',
  },
  JWT: {
    SECRET_KEY: process.env.SECRET_KEY || 'Secret@123',
  },
  DEFAULT_ADMIN: {
    EMAIL: process.env.EMAIL || 'personai@gamil.com',
    PASSWORD: process.env.PASSWORD || 'Secret@123',
    NAME: process.env.NAME || 'Personia',
  },
};
