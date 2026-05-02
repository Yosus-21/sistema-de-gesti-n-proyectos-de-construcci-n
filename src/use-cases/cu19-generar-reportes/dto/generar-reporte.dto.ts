import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { TipoReporte } from '../../../domain/enums';

export class GenerarReporteDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto?: number;

  @IsEnum(TipoReporte)
  tipoReporte: TipoReporte;

  @IsOptional()
  @IsDateString()
  fechaInicioPeriodo?: string;

  @IsOptional()
  @IsDateString()
  fechaFinPeriodo?: string;
}
