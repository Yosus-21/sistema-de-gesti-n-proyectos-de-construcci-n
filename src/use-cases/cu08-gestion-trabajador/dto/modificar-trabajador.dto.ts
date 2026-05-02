import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OcupacionTrabajador } from '../../../domain/enums';

export class ModificarTrabajadorDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTrabajador: number;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  ci?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  correo?: string;

  @IsOptional()
  @IsString()
  licenciaProfesional?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  aniosExperiencia?: number;

  @IsOptional()
  @IsString()
  especializaciones?: string;

  @IsOptional()
  @IsString()
  certificaciones?: string;

  @IsOptional()
  @IsEnum(OcupacionTrabajador)
  ocupacion?: OcupacionTrabajador;
}
