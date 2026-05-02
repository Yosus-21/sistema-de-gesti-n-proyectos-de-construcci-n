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

export class ModificarMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial: number;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(TipoMaterial)
  tipoMaterial?: TipoMaterial;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cantidadDisponible?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costoUnitario?: number;

  @IsOptional()
  @IsString()
  especificacionesTecnicas?: string;
}
