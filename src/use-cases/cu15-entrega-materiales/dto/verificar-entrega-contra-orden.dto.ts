import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerificarEntregaContraOrdenDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idEntregaMaterial: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idOrdenCompra: number;
}
