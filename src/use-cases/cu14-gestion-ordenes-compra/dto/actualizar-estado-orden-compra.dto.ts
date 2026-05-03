import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';
import { EstadoOrdenCompra } from '../../../domain/enums';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarEstadoOrdenCompraDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idOrdenCompra: number;

  @IsEnum(EstadoOrdenCompra)
  @ApiProperty()
  estadoOrden: EstadoOrdenCompra;
}
