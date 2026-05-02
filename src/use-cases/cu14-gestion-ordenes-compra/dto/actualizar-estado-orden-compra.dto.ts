import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';
import { EstadoOrdenCompra } from '../../../domain/enums';

export class ActualizarEstadoOrdenCompraDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idOrdenCompra: number;

  @IsEnum(EstadoOrdenCompra)
  estadoOrden: EstadoOrdenCompra;
}
