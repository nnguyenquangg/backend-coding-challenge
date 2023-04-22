import { MigrationInterface, QueryRunner } from 'typeorm';
import { genSaltSync, hash } from 'bcryptjs';
import { envConfig } from '~config/env.config';

export class InsertRootAdmin1682081329567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const saltRounds = 10;
    const name = envConfig.DEFAULT_ADMIN.NAME;
    const email = envConfig.DEFAULT_ADMIN.EMAIL;
    const plainPassword = envConfig.DEFAULT_ADMIN.PASSWORD;
    const salt = genSaltSync(saltRounds);
    const hashedPassword = await hash(plainPassword, salt);

    await queryRunner.query(
      `
       INSERT  INTO "User" (name,email,password)
       VALUES ($1,$2,$3)
    `,
      [name, email, hashedPassword],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DELETE FROM "User"
        WHERE email = $1
    `,
      [envConfig.DEFAULT_ADMIN.NAME],
    );
  }
}
