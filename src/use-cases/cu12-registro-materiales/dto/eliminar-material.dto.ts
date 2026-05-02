import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class EliminarMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial: number;
}
