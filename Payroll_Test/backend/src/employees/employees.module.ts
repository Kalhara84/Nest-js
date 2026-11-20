import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity.js';
import { EmployeesController } from './employees.controller.js';
import { EmployeesService } from './employees.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  // Register the controller so Nest can handle its API routes.
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
