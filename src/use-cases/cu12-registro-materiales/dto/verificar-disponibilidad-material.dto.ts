import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerificarDisponibilidadMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idMaterial: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  cantidadRequerida: number;
}
