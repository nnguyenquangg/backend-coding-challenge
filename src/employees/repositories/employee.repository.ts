import { EntityRepository, Repository } from 'typeorm';
import { EmployeeEntity } from '../entities/employee.entity';
import { EmployeeWithLevel } from '~employees/types/employee-with-level.type';

@EntityRepository(EmployeeEntity)
export class EmployeeRepository extends Repository<EmployeeEntity> {
  getEmployeesWithLevel(): Promise<EmployeeWithLevel[]> {
    return this.query(`
      WITH RECURSIVE employee_tree AS (
        SELECT id, name, "supervisorId", 0 AS level
        FROM "Employee"
        WHERE "supervisorId" IS NULL
      UNION ALL 
        SELECT e.id, e.name, e."supervisorId", et.level + 1
        FROM "Employee" e
        JOIN employee_tree et ON e."supervisorId" = et.id
      )
      SELECT id, name, level, "supervisorId"
      FROM employee_tree
      ORDER BY level, name;
    `);
  }

  async getSupervisor(name: string): Promise<EmployeeEntity> {
    if (!name.length) {
      return null;
    }
    const supervisor = await this.findOne({ where: { name } });
    if (supervisor) {
      return supervisor;
    }

    return this.save({ name, supervisorId: null });
  }

  async upsertEmployeeRelation(employeeName: string, supervisorId: string = null): Promise<EmployeeEntity> {
    const existedEmployee = await this.findOne({
      where: { name: employeeName },
    });

    if (existedEmployee) {
      return this.save({ ...existedEmployee, supervisorId });
    }

    return this.save({
      name: employeeName,
      supervisorId,
    });
  }

  getHigherSupervisorsOfEmployee(employeeName: string): Promise<EmployeeEntity[]> {
    return this.query(
      `
      WITH RECURSIVE "HigherSupervisors" AS (
        SELECT id, "supervisorId", name
        FROM "Employee"
        WHERE name = $1
        UNION ALL
        SELECT e.id, e."supervisorId", e.name
        FROM "Employee" e
        JOIN  "HigherSupervisors" s
        ON s."supervisorId" = e.id
      )
      SELECT *
      FROM "HigherSupervisors"
    `,
      [employeeName],
    );
  }
}
