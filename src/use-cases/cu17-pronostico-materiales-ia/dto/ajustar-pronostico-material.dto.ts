import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AjustarPronosticoMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idPronosticoMaterial: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockMinimo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockMaximo?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
