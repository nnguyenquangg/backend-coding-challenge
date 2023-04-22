import { EmployeeWithLevel } from './employee-with-level.type';

export type EmployeesHashedByLevel = {
  [key: string]: EmployeeWithLevel[];
};
