import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service.js';
import { CreateEmployeeDto } from './dto/createemp.dto.js';
import { UpdateEmployeeDto } from './dto/updateemp.dto.js';
import { QueryEmployeeDto } from './dto/queryemp.dto.js';

// Base route: /api/employees. The /api prefix comes from main.ts.
@Controller('employees')
export class EmployeesController {
  // The service reads and writes employee data in the database.
  constructor(private readonly service: EmployeesService) {}

  // GET /api/employees - list employees. Read search, page and limit from the URL query.
  @Get()
  findAll(@Query() query: QueryEmployeeDto) {
    return this.service.findAll(query);
  }

  // GET /api/employees/next-number - suggest a number for a new employee.
  @Get('next-number')
  nextNumber() {
    return this.service.nextNumber();
  }

  // GET /api/employees/:id - get one employee. :id is the employee's empsno.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // POST /api/employees - create an employee using JSON from the request body.
  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  // PUT /api/employees/:id - update the employee using JSON from the request body.
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmployeeDto) {
    return this.service.update(id, dto);
  }

  // DELETE /api/employees/:id - delete the employee with this empsno.
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
