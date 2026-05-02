import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConsultarAsignacionContratistaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idAsignacionTarea: number;
}
