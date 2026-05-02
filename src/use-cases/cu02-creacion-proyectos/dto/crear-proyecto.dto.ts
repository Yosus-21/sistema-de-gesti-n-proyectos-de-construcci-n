import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CrearProyectoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idCliente: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  ubicacion: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  presupuesto: number;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFinEstimada: string;

  @IsString()
  @IsNotEmpty()
  especificacionesTecnicas: string;
}
