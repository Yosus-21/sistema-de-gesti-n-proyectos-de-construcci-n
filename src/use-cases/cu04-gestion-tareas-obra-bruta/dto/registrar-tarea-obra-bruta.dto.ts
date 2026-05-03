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
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarTareaObraBrutaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idProyecto: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  descripcion: string;

  @IsEnum(OcupacionTrabajador)
  @ApiProperty()
  perfilRequerido: OcupacionTrabajador;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  duracionEstimada: number;

  @IsDateString()
  @ApiProperty()
  fechaInicioPlanificada: string;

  @IsDateString()
  @ApiProperty()
  fechaFinPlanificada: string;

  @IsEnum(PrioridadTarea)
  @ApiProperty()
  prioridad: PrioridadTarea;
}
