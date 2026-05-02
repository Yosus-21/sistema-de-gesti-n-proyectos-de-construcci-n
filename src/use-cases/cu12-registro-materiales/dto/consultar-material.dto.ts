import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConsultarMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial: number;
}
