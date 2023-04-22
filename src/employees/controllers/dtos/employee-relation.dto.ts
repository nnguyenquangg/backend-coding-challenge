import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { RelationData } from '~employees/interfaces/relation-data.interface';

export class EmployeeRelationDto {
  @ApiProperty()
  @IsNotEmpty()
  data: RelationData;
}
