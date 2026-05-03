import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalcularNivelConfianzaPronosticoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 4,
    description:
      'Pronóstico cuyo nivel de confianza heurístico se desea recalcular.',
  })
  idPronosticoMaterial: number;
}
