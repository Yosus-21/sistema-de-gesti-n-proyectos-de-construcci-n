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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConfigurarAlertaDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idTarea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idMaterial?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  criterioActivacion: string;

  @IsEnum(TipoAlerta)
  @ApiProperty()
  tipoAlerta: TipoAlerta;

  @IsOptional()
  @IsEnum(MetodoNotificacion)
  @ApiPropertyOptional()
  metodoNotificacion?: MetodoNotificacion;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  mensajeNotificacion?: string;
}
