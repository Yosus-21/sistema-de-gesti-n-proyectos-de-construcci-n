import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class EliminarTareaObraFinaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea: number;
}
