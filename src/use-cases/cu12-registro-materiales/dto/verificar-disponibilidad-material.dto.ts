import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class VerificarDisponibilidadMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cantidadRequerida: number;
}
