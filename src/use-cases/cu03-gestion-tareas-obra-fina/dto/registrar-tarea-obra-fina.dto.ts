import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { OcupacionTrabajador, PrioridadTarea } from '../../../domain/enums';

export class RegistrarTareaObraFinaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsEnum(OcupacionTrabajador)
  perfilRequerido: OcupacionTrabajador;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  duracionEstimada: number;

  @IsDateString()
  fechaInicioPlanificada: string;

  @IsDateString()
  fechaFinPlanificada: string;

  @IsEnum(PrioridadTarea)
  prioridad: PrioridadTarea;
}
