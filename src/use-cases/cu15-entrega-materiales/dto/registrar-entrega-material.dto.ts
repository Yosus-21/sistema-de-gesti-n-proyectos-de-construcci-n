import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrarEntregaMaterialDto {
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

  @IsDateString()
  @ApiProperty()
  fechaEntrega: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  cantidadEntregada: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  estadoEntrega?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  observaciones?: string;
}
