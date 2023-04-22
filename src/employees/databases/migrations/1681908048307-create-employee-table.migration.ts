import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmployeeTable1681908048307 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Employee" (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "supervisorId" uuid REFERENCES "Employee"(id),
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX idx_name_employee ON "Employee"(name);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_supervisor_id ON "Employee"("supervisorId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_name_employee"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_supervisor_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Employee"`);
  }
}
