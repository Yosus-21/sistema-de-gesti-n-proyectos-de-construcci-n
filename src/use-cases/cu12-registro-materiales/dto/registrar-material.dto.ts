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

export class RegistrarMaterialDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsEnum(TipoMaterial)
  tipoMaterial: TipoMaterial;

  @IsString()
  @IsNotEmpty()
  unidad: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cantidadDisponible: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costoUnitario: number;

  @IsOptional()
  @IsString()
  especificacionesTecnicas?: string;
}
