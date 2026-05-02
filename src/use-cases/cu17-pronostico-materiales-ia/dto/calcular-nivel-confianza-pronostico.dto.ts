import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CalcularNivelConfianzaPronosticoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idPronosticoMaterial: number;
}
