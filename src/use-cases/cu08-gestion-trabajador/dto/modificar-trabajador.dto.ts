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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModificarTrabajadorDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idTrabajador: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  ci?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  telefono?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  correo?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  licenciaProfesional?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  aniosExperiencia?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  especializaciones?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  certificaciones?: string;

  @IsOptional()
  @IsEnum(OcupacionTrabajador)
  @ApiPropertyOptional()
  ocupacion?: OcupacionTrabajador;
}
