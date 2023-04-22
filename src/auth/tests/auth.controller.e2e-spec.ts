import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { envConfig } from '~config/env.config';
import { TestHelper } from '~core/helpers/test.helper';

describe('EmployeeController (e2e)', () => {
  const testHelper = new TestHelper();

  beforeAll(async () => {
    await testHelper.initialize();
  });

  afterAll(async () => {
    await testHelper.close();
  });

  describe('POST /auth/sign-in', () => {
    it('Login successfully and can access data', async () => {
      const { body } = await testHelper.request
        .post('/auth/sign-in')
        .send({
          email: envConfig.DEFAULT_ADMIN.EMAIL,
          password: envConfig.DEFAULT_ADMIN.PASSWORD,
        })
        .expect(HttpStatus.OK);

      await testHelper.request.get('/employees').set('Authorization', `Bearer ${body.accessToken}`).expect(HttpStatus.OK);
    });

    it('Login failed', async () => {
      await testHelper.request
        .post('/auth/sign-in')
        .send({
          email: envConfig.DEFAULT_ADMIN.EMAIL,
          password: randomUUID({ disableEntropyCache: true }),
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Validate email', async () => {
      await testHelper.request
        .post('/auth/sign-in')
        .send({
          email: randomUUID({ disableEntropyCache: true }),
          password: randomUUID({ disableEntropyCache: true }),
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
