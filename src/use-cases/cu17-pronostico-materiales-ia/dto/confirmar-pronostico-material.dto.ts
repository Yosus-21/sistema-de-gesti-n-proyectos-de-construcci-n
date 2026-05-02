import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConfirmarPronosticoMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idPronosticoMaterial: number;
}
