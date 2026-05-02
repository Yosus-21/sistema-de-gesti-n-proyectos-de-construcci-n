import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ActualizarStockMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial: number;

  @Type(() => Number)
  @IsNumber()
  cantidad: number;

  @IsOptional()
  @IsString()
  motivo?: string;
}
