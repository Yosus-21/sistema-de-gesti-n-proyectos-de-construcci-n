import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class EliminarTrabajadorDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTrabajador: number;
}
