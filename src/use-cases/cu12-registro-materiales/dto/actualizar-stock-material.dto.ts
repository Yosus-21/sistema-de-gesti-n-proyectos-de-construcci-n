import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActualizarStockMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idMaterial: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  cantidad: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  motivo?: string;
}
