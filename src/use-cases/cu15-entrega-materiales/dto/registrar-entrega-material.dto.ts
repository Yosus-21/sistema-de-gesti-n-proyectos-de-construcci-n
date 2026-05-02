import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RegistrarEntregaMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idOrdenCompra: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial: number;

  @IsDateString()
  fechaEntrega: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cantidadEntregada: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  estadoEntrega?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
