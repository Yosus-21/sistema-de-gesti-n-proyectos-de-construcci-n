import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class CrearOrdenCompraDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProveedor: number;

  @IsDateString()
  fechaOrden: string;

  @IsOptional()
  @IsDateString()
  fechaEntregaEstimada?: string;
}
