import {
  IsDateString, IsEmail, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateIf,
} from 'class-validator';

const YN = ['Y', 'N'];

export class CreateEmployeeDto {
  @IsInt() empeno: number;
  @IsString() @IsNotEmpty() @MaxLength(80) empnam: string;
  @IsOptional() @IsString() @MaxLength(20) empinital?: string;
  @IsOptional() @IsIn(['W', 'E', 'S']) empcat?: string;
  @IsOptional() @IsIn(YN) empactflg?: string;
  @IsOptional() @IsString() @MaxLength(1) empsts?: string;
  @IsOptional() @IsInt() empmapcode?: number | null;

  @IsOptional() @IsInt() emplocsno?: number | null;
  @IsOptional() @IsInt() empdepsno?: number | null;
  @IsOptional() @IsInt() empsecsno?: number | null;
  @IsOptional() @IsInt() emparesno?: number | null;
  @IsOptional() @IsInt() empcossno?: number | null;
  @IsOptional() @IsInt() empbasisno?: number | null;

  @IsOptional() @IsNumber() empsal?: number;
  @IsOptional() @IsNumber() empscgpcn?: number;
  @IsOptional() @IsIn(YN) empepfyn?: string;
  @IsOptional() @IsInt() empepfno?: number;
  @IsOptional() @IsIn(YN) emppayeyn?: string;
  @IsOptional() @IsInt() emptno?: number;
  @IsOptional() @IsNumber() empprl?: number;
  @IsOptional() @IsNumber() emptax?: number;
  @IsOptional() @IsNumber() empgin?: number;
  @IsOptional() @IsString() @MaxLength(18) emptin?: string;
  @IsOptional() @IsNumber() empcob?: number;

  @IsOptional() @IsIn(['M', 'F']) empmof?: string;
  @IsOptional() @IsString() @MaxLength(20) empidno?: string;
  @IsOptional() @IsString() @MaxLength(15) emppasportno?: string;
  @IsOptional() @IsDateString() empdob?: string | null;
  @IsOptional() @IsString() @MaxLength(1) empmrdtst?: string;
  @IsOptional() @IsString() @MaxLength(60) empdesig?: string;
  @IsOptional() @IsDateString() empjoin?: string | null;
  @IsOptional() @IsDateString() empleft?: string | null;

  @IsOptional() @IsString() @MaxLength(30) empbnkacno?: string;
  @IsOptional() @IsString() @MaxLength(20) empbnkcode?: string;
  @IsOptional() @IsString() @MaxLength(20) empbnkbranch?: string;
  @IsOptional() @IsString() @MaxLength(20) empbnkid?: string;

  @IsOptional() @IsString() @MaxLength(40) empad1?: string;
  @IsOptional() @IsString() @MaxLength(40) empad2?: string;
  @IsOptional() @IsString() @MaxLength(40) empad3?: string;
  @IsOptional() @IsString() @MaxLength(40) empad4?: string;
  @ValidateIf((o) => !!o.empemail) @IsEmail() @MaxLength(40) empemail?: string;
  @IsOptional() @IsString() @MaxLength(25) emptel?: string;

  @IsOptional() @IsString() @MaxLength(4) empanual?: string;
  @IsOptional() @IsString() @MaxLength(4) empcasal?: string;
  @IsOptional() @IsString() @MaxLength(4) empleuleu?: string;

  @IsOptional() @IsIn(YN) empotflg?: string;
  @IsOptional() @IsIn(YN) empnopflg?: string;
  @IsOptional() @IsIn(YN) empattincflg?: string;
  @IsOptional() @IsIn(YN) emplateflg?: string;
  @IsOptional() @IsIn(YN) empnsatlflg?: string;
}
