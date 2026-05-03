import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ValidarRestriccionesAsignacionMaterialDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    example: 1,
    description: 'Proyecto al que se asocian las restricciones a validar.',
  })
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    example: 10,
    description:
      'Tarea objetivo sobre la cual se valida la restricción propuesta.',
  })
  idTarea?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example:
      'Solo considerar materiales con costo menor a 150 y entrega inmediata.',
    description:
      'Texto libre validado de forma heurística local, sin motor externo de IA.',
  })
  restricciones?: string;
}
