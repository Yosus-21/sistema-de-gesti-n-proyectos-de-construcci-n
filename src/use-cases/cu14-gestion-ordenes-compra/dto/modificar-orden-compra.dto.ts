import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class ModificarOrdenCompraDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idOrdenCompra: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProveedor?: number;

  @IsOptional()
  @IsDateString()
  fechaOrden?: string;

  @IsOptional()
  @IsDateString()
  fechaEntregaEstimada?: string;
}
