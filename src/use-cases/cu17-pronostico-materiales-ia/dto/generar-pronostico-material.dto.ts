import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GenerarPronosticoMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial?: number;

  @IsString()
  @IsNotEmpty()
  periodoAnalisis: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockMinimo: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockMaximo: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
