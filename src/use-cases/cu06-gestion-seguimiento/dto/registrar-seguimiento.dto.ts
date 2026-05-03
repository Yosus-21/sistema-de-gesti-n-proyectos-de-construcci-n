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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrarSeguimientoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idTarea: number;

  @IsDateString()
  @ApiProperty()
  fechaSeguimiento: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  estadoReportado: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  cantidadMaterialUsado: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty()
  porcentajeAvance: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  observaciones?: string;
}
