import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { TipoReporte } from '../../../domain/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerarReporteDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idProyecto?: number;

  @IsEnum(TipoReporte)
  @ApiProperty()
  tipoReporte: TipoReporte;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaInicioPeriodo?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaFinPeriodo?: string;
}
