import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationData } from '../interfaces/relation-data.interface';
import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeeWithLevel } from '~employees/types/employee-with-level.type';
import { EmployeesHashedByLevel } from '~employees/types/employees-hashed-with-level.type';
import { EmployeeRelation } from '~employees/types/employee-relation.type';
import { Connection, EntityManager, IsNull } from 'typeorm';
import { EmployeeEntity } from '~employees/entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(@InjectRepository(EmployeeRepository) private employeeRepo: EmployeeRepository, private connection: Connection) {}

  async getEmployeeNestedDictionary(name: string): Promise<EmployeeRelation> {
    if (name) {
      const employee = await this.employeeRepo.findOne({ where: { name }, relations: ['supervisor', 'employees'] });

      const employeesWithLevel = this.buildEmployeeWithLevel(employee);

      return this.buildRelationTree(employeesWithLevel);
    }

    const employees = await this.employeeRepo.getEmployeesWithLevel();
    return this.buildRelationTree(employees);
  }

  private buildEmployeeWithLevel(employee: EmployeeEntity): EmployeeWithLevel[] {
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    let level = 0;
    const employeesWithLevel: EmployeeWithLevel[] = [];

    const { supervisor, employees } = employee;
    if (employee.supervisor) {
      employeesWithLevel.push({ ...supervisor, level: level++ });
    }
    employeesWithLevel.push({ ...employee, level: level++ });
    employeesWithLevel.push(...employees.map<EmployeeWithLevel>((e) => ({ ...e, level })));

    return employeesWithLevel;
  }

  private buildRelationTree(employees: EmployeeWithLevel[]): EmployeeRelation {
    const employeeWithLevelHashed: EmployeesHashedByLevel = this.buildHashData(employees);
    return this.getMetaData(employeeWithLevelHashed, 0, employees[0]?.supervisorId);
  }

  private buildHashData(employees: EmployeeWithLevel[]): EmployeesHashedByLevel {
    const employeeWithLevelHashed: EmployeesHashedByLevel = {};
    for (const employee of employees) {
      if (!employeeWithLevelHashed[employee.level]) {
        employeeWithLevelHashed[employee.level] = [];
      }
      employeeWithLevelHashed[employee.level].push(employee);
    }

    return employeeWithLevelHashed;
  }

  private getMetaData(
    employeeWithLevelHashed: EmployeesHashedByLevel,
    level: number,
    supervisorId: string = null,
  ): EmployeeRelation {
    const employeesOfSuperior =
      employeeWithLevelHashed[level.toString()]?.filter((employee) => employee.supervisorId === supervisorId) || [];

    let data: EmployeeRelation = {};
    for (const employee of employeesOfSuperior) {
      data = Object.assign(data, {
        [employee.name]: this.getMetaData(employeeWithLevelHashed, employee.level + 1, employee.id),
      });
    }

    return data;
  }

  async createEmployeeRelations(data: RelationData): Promise<void> {
    return this.connection.transaction(async (entityManager: EntityManager) => {
      const employeeRepo = entityManager.getCustomRepository(EmployeeRepository);

      for (const [employeeName, supervisorName] of Object.entries(data)) {
        await this.validateSupervisorAndEmployeeRelation(employeeName, supervisorName, entityManager);

        const supervisor = await employeeRepo.getSupervisor(supervisorName);
        if (employeeName === supervisorName) {
          continue;
        }

        await employeeRepo.upsertEmployeeRelation(employeeName, supervisor?.id);
      }
      await this.validateRootOfTree(entityManager);
    });
  }

  private async validateRootOfTree(entityManager: EntityManager) {
    const employeeRepo = entityManager.getCustomRepository(EmployeeRepository);
    const [roots, count] = await employeeRepo.findAndCount({ where: { supervisorId: IsNull() } });

    if (count > 1) {
      throw new BadRequestException(`Employee list with more than one root: ${roots.map((root) => root.name).join(', ')}.`);
    }
  }

  private async validateSupervisorAndEmployeeRelation(
    employee: string,
    supervisor: string,
    entityManager: EntityManager,
  ): Promise<boolean> {
    const employeeRepo = entityManager.getCustomRepository(EmployeeRepository);
    if (employee === supervisor) {
      return true;
    }

    const [existedEmployee, existedSupervisor, higherSupervisors] = await Promise.all([
      employeeRepo.findOne({ where: { name: employee } }),
      employeeRepo.findOne({ where: { name: supervisor } }),
      employeeRepo.getHigherSupervisorsOfEmployee(supervisor),
    ]);

    if (!existedEmployee || !existedSupervisor) {
      return true;
    }

    if (higherSupervisors.find((supervisor) => supervisor.id === existedEmployee.id)) {
      throw new BadRequestException(
        `${employee} can’t become ${supervisor}’s employee because ${supervisor} is ${employee}’s inferior.`,
      );
    }
  }
}
