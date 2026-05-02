import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class VerificarEntregaContraOrdenDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idEntregaMaterial: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  idOrdenCompra: number;
}
