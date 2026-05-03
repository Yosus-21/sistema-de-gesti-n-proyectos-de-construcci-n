import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TipoMaterial } from '../../../domain/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModificarMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idMaterial: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  descripcion?: string;

  @IsOptional()
  @IsEnum(TipoMaterial)
  @ApiPropertyOptional()
  tipoMaterial?: TipoMaterial;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  unidad?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  cantidadDisponible?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  costoUnitario?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  especificacionesTecnicas?: string;
}
