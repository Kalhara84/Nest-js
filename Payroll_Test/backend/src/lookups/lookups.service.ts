import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaMast, Department, Location, SysMast } from './lookup.entities.js';

@Injectable()
export class LookupsService {
  constructor(
    @InjectRepository(Location) private locations: Repository<Location>,
    @InjectRepository(Department) private departments: Repository<Department>,
    @InjectRepository(SysMast) private sys: Repository<SysMast>,
    @InjectRepository(AreaMast) private areas: Repository<AreaMast>,
  ) {}

  async findAll() {
    const [locations, departments, sections, costCenters, basis, areas] = await Promise.all([
      this.locations.find({ order: { locnam: 'ASC' } }),
      this.departments.find({ order: { depdes: 'ASC' } }),
      this.sys.find({ where: { sysrtp: 261 }, order: { sysdes: 'ASC' } }),
      this.sys.find({ where: { sysrtp: 260 }, order: { sysrno: 'ASC' } }),
      this.sys.find({ where: { sysrtp: 200 }, order: { sysdes: 'ASC' } }),
      this.areas.find({ where: { sysrtp: 202 }, order: { sysrno: 'ASC' } }),
    ]);
    return { locations, departments, sections, costCenters, basis, areas };
  }
}
