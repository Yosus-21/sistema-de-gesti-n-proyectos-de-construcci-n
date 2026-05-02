import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConsultarSeguimientoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idSeguimiento: number;
}
