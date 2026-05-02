import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class RegistrarSeguimientoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea: number;

  @IsDateString()
  fechaSeguimiento: string;

  @IsString()
  @IsNotEmpty()
  estadoReportado: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cantidadMaterialUsado: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeAvance: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
