import { Controller, Get } from '@nestjs/common';
import { LookupsService } from './lookups.service.js';

// Base route: /api/lookups. The /api prefix comes from main.ts.
@Controller('lookups')
export class LookupsController {
  // The service reads lookup data from the database.
  constructor(private readonly service: LookupsService) {}

  // GET /api/lookups - get locations, departments, sections, cost centers, basis and areas.
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
