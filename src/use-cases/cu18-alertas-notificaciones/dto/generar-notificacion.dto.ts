import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { MetodoNotificacion } from '../../../domain/enums';

export class GenerarNotificacionDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idAlerta: number;

  @IsOptional()
  @IsString()
  mensajeNotificacion?: string;

  @IsOptional()
  @IsEnum(MetodoNotificacion)
  metodoNotificacion?: MetodoNotificacion;
}
