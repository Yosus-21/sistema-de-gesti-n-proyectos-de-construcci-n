import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidarVigenciaContratoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idContrato: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaReferencia?: string;
}
