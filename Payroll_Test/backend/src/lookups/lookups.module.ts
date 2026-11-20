import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LookupsController } from './lookups.controller.js';
import { LookupsService } from './lookups.service.js';
import { AreaMast, Department, Location, SysMast } from './lookup.entities.js';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Department, SysMast, AreaMast])],
  controllers: [LookupsController],
  providers: [LookupsService],
})
export class LookupsModule {}
