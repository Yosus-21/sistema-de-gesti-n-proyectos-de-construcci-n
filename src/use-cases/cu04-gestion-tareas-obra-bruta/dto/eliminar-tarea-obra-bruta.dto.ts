import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class EliminarTareaObraBrutaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea: number;
}
