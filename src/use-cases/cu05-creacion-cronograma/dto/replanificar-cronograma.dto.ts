import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReplanificarCronogramaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idCronograma: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  motivoReplanificacion: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  nuevasAccionesAnteRetraso?: string;
}
