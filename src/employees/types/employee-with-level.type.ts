import { EmployeeEntity } from '~employees/entities/employee.entity';

export type EmployeeWithLevel = EmployeeEntity & { level: number };
