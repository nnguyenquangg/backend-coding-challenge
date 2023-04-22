import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from '~config/orm.config';
import { EmployeeModule } from '~employees/employee.module';
import { AuthModule } from '~auth/auth.module';

@Module({
  imports: [AuthModule, EmployeeModule, ormConfig],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
