import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModificarOrdenCompraDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idOrdenCompra: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idProveedor?: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaOrden?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaEntregaEstimada?: string;
}
