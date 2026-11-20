// Data returned by the backend API.
export interface Location {
  locsno: number;
  locloc: string;
  locnam: string | null;
}

export interface Department {
  depsno: number;
  depdep: string;
  depdes: string | null;
}

export interface SysItem {
  syssno: number;
  sysrtp: number;
  sysrno: string;
  sysdes: string;
}

export interface Lookups {
  locations: Location[];
  departments: Department[];
  sections: SysItem[];
  costCenters: SysItem[];
  basis: SysItem[];
  areas: SysItem[];
}

export interface Paged<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Employee {
  empsno: number;
  empeno: number;
  empinital: string;
  empnam: string;
  empcat: string;
  empactflg: string;
  empsts: string;
  empmapcode: number | null;
  emplocsno: number | null;
  empdepsno: number | null;
  empsecsno: number | null;
  emparesno: number | null;
  empcossno: number | null;
  empbasisno: number | null;
  department?: Department | null;
  location?: Location | null;
  empsal: number;
  empscgpcn: number;
  empepfyn: string;
  empepfno: number;
  emppayeyn: string;
  emptno: number;
  empprl: number;
  emptax: number;
  empgin: number;
  emptin: string;
  empcob: number;
  empmof: string;
  empidno: string;
  emppasportno: string;
  empdob: string | null;
  empmrdtst: string;
  empdesig: string;
  empjoin: string | null;
  empleft: string | null;
  empbnkacno: string;
  empbnkcode: string;
  empbnkbranch: string;
  empbnkid: string;
  empad1: string;
  empad2: string;
  empad3: string;
  empad4: string;
  empemail: string;
  emptel: string;
  empanual: string;
  empcasal: string;
  empleuleu: string;
  empotflg: string;
  empnopflg: string;
  empattincflg: string;
  emplateflg: string;
  empnsatlflg: string;
}
