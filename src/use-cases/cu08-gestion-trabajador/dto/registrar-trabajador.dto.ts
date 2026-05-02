import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OcupacionTrabajador } from '../../../domain/enums';

export class RegistrarTrabajadorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  ci: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  correo: string;

  @IsOptional()
  @IsString()
  licenciaProfesional?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  aniosExperiencia: number;

  @IsOptional()
  @IsString()
  especializaciones?: string;

  @IsOptional()
  @IsString()
  certificaciones?: string;

  @IsEnum(OcupacionTrabajador)
  ocupacion: OcupacionTrabajador;
}
