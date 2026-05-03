import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModificarAsignacionObraBrutaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idAsignacionTarea: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idTarea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idTrabajador?: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaAsignacion?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  rolEnLaTarea?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  observaciones?: string;
}
