import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OcupacionTrabajador, PrioridadTarea } from '../../../domain/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModificarTareaObraFinaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idTarea: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idProyecto?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  descripcion?: string;

  @IsOptional()
  @IsEnum(OcupacionTrabajador)
  @ApiPropertyOptional()
  perfilRequerido?: OcupacionTrabajador;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  duracionEstimada?: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaInicioPlanificada?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaFinPlanificada?: string;

  @IsOptional()
  @IsEnum(PrioridadTarea)
  @ApiPropertyOptional()
  prioridad?: PrioridadTarea;
}
