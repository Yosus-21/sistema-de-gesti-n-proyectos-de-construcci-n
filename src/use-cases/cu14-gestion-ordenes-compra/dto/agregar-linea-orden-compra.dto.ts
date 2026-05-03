import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AgregarLineaOrdenCompraDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idOrdenCompra: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idMaterial: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  cantidadSolicitada: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  precioUnitarioAcordado: number;
}
