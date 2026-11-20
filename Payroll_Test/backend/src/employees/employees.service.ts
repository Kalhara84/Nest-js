import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity.js';
import { CreateEmployeeDto } from './dto/createemp.dto.js';
import { UpdateEmployeeDto } from './dto/updateemp.dto.js';
import { QueryEmployeeDto } from './dto/queryemp.dto.js';

@Injectable()
export class EmployeesService {
  constructor(@InjectRepository(Employee) private readonly repo: Repository<Employee>) {}

  /** VIEW (list) - search + paging */
  async findAll(query: QueryEmployeeDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.repo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.department', 'd')
      .leftJoinAndSelect('e.location', 'l');

    if (query.search?.trim()) {
      qb.where(
        '(e.empnam ILIKE :s OR CAST(e.empeno AS TEXT) LIKE :s OR e.empidno ILIKE :s OR e.empdesig ILIKE :s)',
        { s: `%${query.search.trim()}%` },
      );
    }

    const [data, total] = await qb
      .orderBy('e.empeno', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
  }

  /** VIEW (single) */
  async findOne(id: number) {
    const emp = await this.repo.findOne({
      where: { empsno: id },
      relations: { department: true, location: true },
    });
    if (!emp) throw new NotFoundException(`Employee #${id} not found`);
    return emp;
  }

  /** ADD */
  async create(dto: CreateEmployeeDto) {
    await this.checkDuplicates(dto);
    const emp = this.repo.create(dto);
    return this.repo.save(emp);
  }

  /** UPDATE */
  async update(id: number, dto: UpdateEmployeeDto) {
    const emp = await this.findOne(id);
    await this.checkDuplicates(dto, id);
    // relations are loaded only for display - drop them before saving
    delete emp.department;
    delete emp.location;
    Object.assign(emp, dto);
    await this.repo.save(emp);
    return this.findOne(id);
  }

  /** DELETE */
  async remove(id: number) {
    const emp = await this.findOne(id);
    await this.repo.delete(emp.empsno);
    return { message: `Employee ${emp.empeno} deleted` };
  }

  /** same checks as the old PHP screen: unique employee no + unique map code */
  private async checkDuplicates(dto: Partial<CreateEmployeeDto>, ignoreId?: number) {
    if (dto.empeno !== undefined) {
      const found = await this.repo.findOne({ where: { empeno: dto.empeno } });
      if (found && found.empsno !== ignoreId) {
        throw new ConflictException(`Employee No ${dto.empeno} already exists`);
      }
    }
    if (dto.empmapcode) {
      const found = await this.repo.findOne({ where: { empmapcode: dto.empmapcode } });
      if (found && found.empsno !== ignoreId) {
        throw new ConflictException(`Map Code ${dto.empmapcode} already exists`);
      }
    }
  }
}
