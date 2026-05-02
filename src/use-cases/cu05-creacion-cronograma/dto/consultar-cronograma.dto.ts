import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConsultarCronogramaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idCronograma: number;
}
