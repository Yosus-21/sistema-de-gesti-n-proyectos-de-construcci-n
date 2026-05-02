import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MetodoNotificacion, TipoAlerta } from '../../../domain/enums';

export class ConfigurarAlertaDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial?: number;

  @IsString()
  @IsNotEmpty()
  criterioActivacion: string;

  @IsEnum(TipoAlerta)
  tipoAlerta: TipoAlerta;

  @IsOptional()
  @IsEnum(MetodoNotificacion)
  metodoNotificacion?: MetodoNotificacion;

  @IsOptional()
  @IsString()
  mensajeNotificacion?: string;
}
