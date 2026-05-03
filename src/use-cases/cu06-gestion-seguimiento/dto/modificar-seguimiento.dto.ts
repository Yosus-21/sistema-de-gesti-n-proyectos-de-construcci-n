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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModificarSeguimientoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idSeguimiento: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idTarea?: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaSeguimiento?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  estadoReportado?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  cantidadMaterialUsado?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiPropertyOptional()
  porcentajeAvance?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  observaciones?: string;
}
