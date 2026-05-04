import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
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

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description:
      'Obligatorio si el método es EMAIL y el entorno tiene emails habilitados',
  })
  correoDestino?: string;
}
