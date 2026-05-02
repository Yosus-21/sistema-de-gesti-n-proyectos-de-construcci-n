import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConsultarEntregaMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idEntregaMaterial: number;
}
