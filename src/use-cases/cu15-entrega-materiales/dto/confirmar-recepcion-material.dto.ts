import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConfirmarRecepcionMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idEntregaMaterial: number;
}
