import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerarPronosticoMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 1,
    description: 'Proyecto sobre el cual se generará el pronóstico heurístico.',
  })
  idProyecto: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    example: 3,
    description:
      'Material específico a evaluar dentro del pronóstico provisional.',
  })
  idMaterial?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Próximos 30 días',
    description:
      'Ventana temporal usada por la heurística local para estimar necesidades.',
  })
  periodoAnalisis: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 50,
    description:
      'Umbral mínimo esperado de stock para el material o grupo analizado.',
  })
  stockMinimo: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 120,
    description:
      'Umbral máximo esperado de stock para el material o grupo analizado.',
  })
  stockMaximo: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Pronóstico provisional basado en rango de stock actual.',
    description:
      'Observaciones libres; si se omite, el backend agrega una nota heurística provisional.',
  })
  observaciones?: string;
}
