import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CalcularMontoTotalOrdenCompraDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idOrdenCompra: number;
}
