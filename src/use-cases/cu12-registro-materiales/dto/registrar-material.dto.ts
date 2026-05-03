import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TipoMaterial } from '../../../domain/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrarMaterialDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  descripcion: string;

  @IsEnum(TipoMaterial)
  @ApiProperty()
  tipoMaterial: TipoMaterial;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  unidad: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  cantidadDisponible: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  costoUnitario: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  especificacionesTecnicas?: string;
}
