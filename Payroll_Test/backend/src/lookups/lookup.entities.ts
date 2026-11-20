import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** s_locmast - Locations */
@Entity('s_locmast')
export class Location {
  @PrimaryGeneratedColumn() locsno: number;
  @Column({ type: 'varchar', length: 6 }) locloc: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) locnam: string | null;
}

/** f_depmast - Departments */
@Entity('f_depmast')
export class Department {
  @PrimaryGeneratedColumn() depsno: number;
  @Column({ type: 'varchar', length: 6 }) depdep: string;
  @Column({ type: 'varchar', length: 30, nullable: true }) depdes: string | null;
}

/** p_sysmast - Section (261), Cost Center (260), Basis (200) */
@Entity('p_sysmast')
export class SysMast {
  @PrimaryGeneratedColumn() syssno: number;
  @Column({ type: 'int' }) sysrtp: number;
  @Column({ type: 'varchar', length: 10 }) sysrno: string;
  @Column({ type: 'varchar', length: 40 }) sysdes: string;
}

/** a_sysmast - Area (202) */
@Entity('a_sysmast')
export class AreaMast {
  @PrimaryGeneratedColumn() syssno: number;
  @Column({ type: 'int' }) sysrtp: number;
  @Column({ type: 'varchar', length: 10 }) sysrno: string;
  @Column({ type: 'varchar', length: 40 }) sysdes: string;
}
