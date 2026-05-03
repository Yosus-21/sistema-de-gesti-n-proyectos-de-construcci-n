import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearOrdenCompraDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idProveedor: number;

  @IsDateString()
  @ApiProperty()
  fechaOrden: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaEntregaEstimada?: string;
}
