import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AjustarAsignacionMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 5,
    description:
      'Identificador de la asignación provisional que se desea ajustar.',
  })
  idAsignacionMaterial: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    example: 8,
    description: 'Nueva cantidad propuesta antes de confirmar la asignación.',
  })
  cantidadAsignada?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    example: 200,
    description: 'Nuevo tope de costo permitido para la propuesta heurística.',
  })
  costoMaximoPermitido?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Mantener prioridad por materiales disponibles en bodega central.',
    description:
      'Restricciones o notas adicionales para la propuesta provisional.',
  })
  restricciones?: string;
}
