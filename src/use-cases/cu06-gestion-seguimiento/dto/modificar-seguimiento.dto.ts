import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ModificarSeguimientoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idSeguimiento: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea?: number;

  @IsOptional()
  @IsDateString()
  fechaSeguimiento?: string;

  @IsOptional()
  @IsString()
  estadoReportado?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cantidadMaterialUsado?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeAvance?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
