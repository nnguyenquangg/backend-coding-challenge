import { HttpStatus } from '@nestjs/common';
import { TestHelper } from '~core/helpers/test.helper';

describe('EmployeeController (e2e)', () => {
  const testHelper = new TestHelper();
  let accessToken: string;

  beforeAll(async () => {
    await testHelper.initialize();
    accessToken = await testHelper.getAdminAccessToken();
  });

  afterAll(async () => {
    await testHelper.close();
  });

  describe('POST /employees', () => {
    const data = {
      Pete: 'Nick',
      Barbara: 'Nick',
      Nick: 'Sophie',
      Sophie: 'Jonas',
    };

    const expectedResult = {
      Jonas: {
        Sophie: {
          Nick: {
            Pete: {},
            Barbara: {},
          },
        },
      },
    };

    it('Create employee relations without accessToken', async () => {
      await testHelper.request.post('/employees').send({ data }).expect(HttpStatus.UNAUTHORIZED);
    });

    it('Create employee relations successfully', async () => {
      const reorderDate = {
        Nick: 'Sophie',
        Sophie: 'Jonas',
        Pete: 'Nick',
        Barbara: 'Nick',
      };
      await testHelper.request
        .post('/employees')
        .send({ data: reorderDate })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.CREATED);

      const { body: result } = await testHelper.request
        .get('/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(Object.keys(result['Jonas'])[0]).toEqual('Sophie');
      expect(Object.keys(result['Jonas']['Sophie'])[0]).toEqual('Nick');
      expect(Object.keys(result['Jonas']['Sophie']['Nick'])[0]).toEqual('Barbara');
      expect(Object.keys(result['Jonas']['Sophie']['Nick'])[1]).toEqual('Pete');

      expect(result).toEqual(expectedResult);
    });

    it('Keep the employee relations when reorder data input', async () => {
      await testHelper.request
        .post('/employees')
        .send({ data })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.CREATED);

      const { body: result } = await testHelper.request
        .get('/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(result).toEqual(expectedResult);
    });

    it('Throw multiples root exception when the input data makes multiple roots', async () => {
      const data = { Persion: '' };
      const { body } = await testHelper.request
        .post('/employees')
        .send({ data })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.BAD_REQUEST);

      expect(body.message).toEqual(`Employee list with more than one root: Jonas, Persion.`);

      const { body: result } = await testHelper.request
        .get('/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(result).toEqual(expectedResult);
    });

    it('Throw loop relations exception when  the input data input makes loop relations ', async () => {
      const data = { Sophie: 'Barbara' };
      const { body } = await testHelper.request
        .post('/employees')
        .send({ data })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.BAD_REQUEST);

      expect(body.message).toEqual(`Sophie can’t become Barbara’s employee because Barbara is Sophie’s inferior.`);

      const { body: result } = await testHelper.request
        .get('/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(result).toEqual(expectedResult);
    });

    it('Update employee relations successfully with old and new relations', async () => {
      const newDataRelations = {
        Pete: 'Nick',
        Barbara: 'Nick',
        Nick: 'Sophie',
        Sophie: 'Jonas',
        Judas: 'Jonas',
      };

      const newExpectedResult = {
        Jonas: {
          Judas: {},
          Sophie: {
            Nick: {
              Pete: {},
              Barbara: {},
            },
          },
        },
      };

      await testHelper.request
        .post('/employees')
        .send({ data: newDataRelations })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.CREATED);

      const { body: result } = await testHelper.request
        .get('/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(Object.keys(result['Jonas'])[0]).toEqual('Judas');
      expect(Object.keys(result['Jonas'])[1]).toEqual('Sophie');
      expect(Object.keys(result['Jonas']['Sophie']['Nick'])[0]).toEqual('Barbara');
      expect(Object.keys(result['Jonas']['Sophie']['Nick'])[1]).toEqual('Pete');

      expect(result).toEqual(newExpectedResult);
    });

    it('Update employee relations successfully with new relations', async () => {
      const newDataRelations = {
        Barbara: 'Sophie',
        Nick: 'Jonas',
      };

      const newExpectedResult = {
        Jonas: {
          Judas: {},
          Sophie: {
            Barbara: {},
          },
          Nick: {
            Pete: {},
          },
        },
      };

      await testHelper.request
        .post('/employees')
        .send({ data: newDataRelations })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.CREATED);

      const { body: result } = await testHelper.request
        .get('/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(Object.keys(result['Jonas'])[0]).toEqual('Judas');
      expect(Object.keys(result['Jonas'])[1]).toEqual('Nick');
      expect(Object.keys(result['Jonas'])[2]).toEqual('Sophie');
      expect(Object.keys(result['Jonas']['Judas'])[0]).toBeUndefined();
      expect(Object.keys(result['Jonas']['Sophie'])[0]).toEqual('Barbara');
      expect(Object.keys(result['Jonas']['Nick'])[0]).toEqual('Pete');

      expect(result).toEqual(newExpectedResult);
    });
  });

  describe('GET /employees', () => {
    it('Throw unauthorized exception when request without token', async () => {
      await testHelper.request.get('/employees').expect(HttpStatus.UNAUTHORIZED);
    });

    it('Get all employee relations successfully', async () => {
      const expectedResult = {
        Jonas: {
          Judas: {},
          Sophie: {
            Barbara: {},
          },
          Nick: {
            Pete: {},
          },
        },
      };

      const { body: result } = await testHelper.request
        .get('/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(result).toEqual(expectedResult);
    });

    it('Get relations of an employee by name (supervisor and employees)', async () => {
      const expectedResult = {
        Jonas: {
          Sophie: {
            Barbara: {},
          },
        },
      };

      const { body: result } = await testHelper.request
        .get('/employees?name=Sophie')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(result).toEqual(expectedResult);
    });

    it('Get relations of an employee by name (only employees)', async () => {
      const expectedResult = {
        Jonas: {
          Judas: {},
          Sophie: {},
          Nick: {},
        },
      };

      const { body: result } = await testHelper.request
        .get('/employees?name=Jonas')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(result).toEqual(expectedResult);
    });

    it('Get relations of an employee by name (only supervisor)', async () => {
      const expectedResult = {
        Sophie: {
          Barbara: {},
        },
      };

      const { body: result } = await testHelper.request
        .get('/employees?name=Barbara')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(result).toEqual(expectedResult);
    });

    it(`Throw not found exception when employee isn't existed`, async () => {
      const { body: result } = await testHelper.request
        .get('/employees?name=JohnWick')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(result.message).toEqual('Employee not found');
    });
  });
});
