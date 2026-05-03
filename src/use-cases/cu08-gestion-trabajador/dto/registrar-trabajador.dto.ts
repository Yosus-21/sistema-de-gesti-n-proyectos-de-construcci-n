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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrarTrabajadorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ci: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  correo: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  licenciaProfesional?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  aniosExperiencia: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  especializaciones?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  certificaciones?: string;

  @IsEnum(OcupacionTrabajador)
  @ApiProperty()
  ocupacion: OcupacionTrabajador;
}
