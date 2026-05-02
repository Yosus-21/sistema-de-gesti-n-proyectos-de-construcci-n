import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConsultarOrdenCompraDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idOrdenCompra: number;
}
