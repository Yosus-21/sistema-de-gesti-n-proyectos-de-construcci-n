import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AjustarPronosticoMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 4,
    description: 'Identificador del pronóstico que se desea ajustar.',
  })
  idPronosticoMaterial: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    example: 40,
    description: 'Nuevo stock mínimo de referencia para el pronóstico.',
  })
  stockMinimo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    example: 140,
    description: 'Nuevo stock máximo de referencia para el pronóstico.',
  })
  stockMaximo?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Se amplía el rango por aumento temporal de demanda.',
    description: 'Observaciones operativas sobre el ajuste del pronóstico.',
  })
  observaciones?: string;
}
