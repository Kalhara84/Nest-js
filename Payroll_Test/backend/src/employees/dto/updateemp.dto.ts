import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './createemp.dto.js';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
