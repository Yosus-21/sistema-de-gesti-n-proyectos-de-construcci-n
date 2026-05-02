import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConsultarTrabajadorDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTrabajador: number;
}
