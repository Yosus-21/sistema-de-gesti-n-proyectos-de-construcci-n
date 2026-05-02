import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConsultarAsignacionObraBrutaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idAsignacionTarea: number;
}
