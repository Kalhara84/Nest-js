import { Controller, Get } from '@nestjs/common';
import { LookupsService } from './lookups.service.js';

@Controller('lookups')
export class LookupsController {
  constructor(private readonly service: LookupsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
