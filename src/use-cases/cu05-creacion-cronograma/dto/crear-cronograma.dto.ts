import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EstadoCronograma } from '../../../domain/enums';

export class CrearCronogramaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(EstadoCronograma)
  estadoInicial: EstadoCronograma;

  @IsOptional()
  @IsString()
  accionesAnteRetraso?: string;
}
