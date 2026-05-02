import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class AgregarLineaOrdenCompraDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idOrdenCompra: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cantidadSolicitada: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioUnitarioAcordado: number;
}
