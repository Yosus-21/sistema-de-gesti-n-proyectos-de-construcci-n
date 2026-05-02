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

export class ModificarTareaObraBrutaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto?: number;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(OcupacionTrabajador)
  perfilRequerido?: OcupacionTrabajador;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  duracionEstimada?: number;

  @IsOptional()
  @IsDateString()
  fechaInicioPlanificada?: string;

  @IsOptional()
  @IsDateString()
  fechaFinPlanificada?: string;

  @IsOptional()
  @IsEnum(PrioridadTarea)
  prioridad?: PrioridadTarea;
}
