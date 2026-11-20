import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Department, Location } from '../lookups/lookup.entities.js';

/** p_empmast - Employee master (only the columns used by the Employee Master screen) */
@Entity('p_empmast')
export class Employee {
  @PrimaryGeneratedColumn() empsno: number;

  @Column({ type: 'int' }) empeno: number; // Employee / EPF# key
  @Column({ type: 'varchar', length: 20, default: '' }) empinital: string;
  @Column({ type: 'varchar', length: 80 }) empnam: string;
  @Column({ type: 'varchar', length: 1, default: 'W' }) empcat: string; // W / E / S
  @Column({ type: 'char', length: 1, default: 'Y' }) empactflg: string;
  @Column({ type: 'varchar', length: 1, default: '' }) empsts: string;
  @Column({ type: 'int', nullable: true }) empmapcode: number | null;

  // lookups
  @Column({ type: 'int', nullable: true }) emplocsno: number | null;
  @Column({ type: 'int', nullable: true }) empdepsno: number | null;
  @Column({ type: 'int', nullable: true }) empsecsno: number | null;
  @Column({ type: 'int', nullable: true }) emparesno: number | null;
  @Column({ type: 'int', nullable: true }) empcossno: number | null;
  @Column({ type: 'int', nullable: true }) empbasisno: number | null;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'empdepsno' })
  department?: Department;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'emplocsno' })
  location?: Location;

  // salary & statutory
  @Column({ type: 'double precision', default: 0 }) empsal: number;
  @Column({ type: 'double precision', default: 0 }) empscgpcn: number;
  @Column({ type: 'char', length: 1, default: 'Y' }) empepfyn: string;
  @Column({ type: 'int', default: 0 }) empepfno: number;
  @Column({ type: 'char', length: 1, default: 'N' }) emppayeyn: string;
  @Column({ type: 'int', default: 0 }) emptno: number;
  @Column({ type: 'double precision', default: 0 }) empprl: number;
  @Column({ type: 'double precision', default: 0 }) emptax: number;
  @Column({ type: 'double precision', default: 0 }) empgin: number;
  @Column({ type: 'varchar', length: 18, default: '' }) emptin: string;
  @Column({ type: 'double precision', default: 0 }) empcob: number;

  // personal
  @Column({ type: 'char', length: 1, default: 'M' }) empmof: string; // M / F
  @Column({ type: 'varchar', length: 20, default: '' }) empidno: string; // National ID
  @Column({ type: 'varchar', length: 15, default: '' }) emppasportno: string;
  @Column({ type: 'date', nullable: true }) empdob: string | null;
  @Column({ type: 'char', length: 1, default: '' }) empmrdtst: string; // married
  @Column({ type: 'varchar', length: 60, default: '' }) empdesig: string;
  @Column({ type: 'date', nullable: true }) empjoin: string | null;
  @Column({ type: 'date', nullable: true }) empleft: string | null;

  // bank
  @Column({ type: 'varchar', length: 30, default: '' }) empbnkacno: string;
  @Column({ type: 'varchar', length: 20, default: '' }) empbnkcode: string;
  @Column({ type: 'varchar', length: 20, default: '' }) empbnkbranch: string;
  @Column({ type: 'varchar', length: 20, default: '' }) empbnkid: string;

  // contact
  @Column({ type: 'varchar', length: 40, default: '' }) empad1: string;
  @Column({ type: 'varchar', length: 40, default: '' }) empad2: string;
  @Column({ type: 'varchar', length: 40, default: '' }) empad3: string;
  @Column({ type: 'varchar', length: 40, default: '' }) empad4: string;
  @Column({ type: 'varchar', length: 40, default: '' }) empemail: string;
  @Column({ type: 'varchar', length: 25, default: '' }) emptel: string;

  // leave entitlements
  @Column({ type: 'varchar', length: 4, default: '' }) empanual: string;
  @Column({ type: 'varchar', length: 4, default: '' }) empcasal: string;
  @Column({ type: 'varchar', length: 4, default: '' }) empleuleu: string;

  // Y/N flags
  @Column({ type: 'char', length: 1, default: 'N' }) empotflg: string;
  @Column({ type: 'char', length: 1, default: 'N' }) empnopflg: string;
  @Column({ type: 'char', length: 1, default: 'N' }) empattincflg: string;
  @Column({ type: 'char', length: 1, default: 'N' }) emplateflg: string;
  @Column({ type: 'char', length: 1, default: 'N' }) empnsatlflg: string;
}
