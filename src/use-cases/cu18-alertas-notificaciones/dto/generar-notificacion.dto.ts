import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { MetodoNotificacion } from '../../../domain/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerarNotificacionDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idAlerta: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  mensajeNotificacion?: string;

  @IsOptional()
  @IsEnum(MetodoNotificacion)
  @ApiPropertyOptional()
  metodoNotificacion?: MetodoNotificacion;
}
