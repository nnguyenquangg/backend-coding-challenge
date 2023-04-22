import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmployeeService } from '~employees/services/employee.service';
import { EmployeeRelationDto } from '../dtos/employee-relation.dto';
import { EmployeeRelation } from '~employees/types/employee-relation.type';
import { Authenticated } from '~core/decorators/authenticated.decorator';

@Controller('employees')
@ApiTags('Employees')
@ApiBearerAuth()
@Authenticated()
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getEmployeeNestedDictionary(@Query('name') name: string): Promise<EmployeeRelation> {
    return this.employeeService.getEmployeeNestedDictionary(name);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createEmployeeRelations(@Body() { data }: EmployeeRelationDto): Promise<void> {
    return this.employeeService.createEmployeeRelations(data);
  }
}
