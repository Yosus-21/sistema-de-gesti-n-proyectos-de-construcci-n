import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GenerarPropuestaAsignacionMaterialDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    example: 1,
    description:
      'Proyecto a considerar para generar una propuesta heurística de asignación.',
  })
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    example: 10,
    description: 'Tarea objetivo para la propuesta provisional de asignación.',
  })
  idTarea?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Priorizar materiales con mayor stock disponible y menor costo.',
    description:
      'Criterios descriptivos usados por la heurística interna provisional.',
  })
  criteriosPrioridad?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    example: 150.5,
    description:
      'Tope opcional de costo unitario que la heurística debe respetar.',
  })
  costoMaximoPermitido?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'No asignar materiales con entrega estimada mayor a 7 días.',
    description:
      'Restricciones de negocio evaluadas de forma local, sin IA externa.',
  })
  restricciones?: string;
}
