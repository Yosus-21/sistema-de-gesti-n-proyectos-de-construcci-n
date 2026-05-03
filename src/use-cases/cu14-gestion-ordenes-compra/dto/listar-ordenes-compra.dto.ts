import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto';
import { EstadoOrdenCompra } from '../../../domain/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListarOrdenesCompraDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idProveedor?: number;

  @IsOptional()
  @IsEnum(EstadoOrdenCompra)
  @ApiPropertyOptional()
  estadoOrden?: EstadoOrdenCompra;
}
