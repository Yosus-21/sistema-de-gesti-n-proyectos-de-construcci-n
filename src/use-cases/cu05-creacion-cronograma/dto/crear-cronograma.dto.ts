import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EstadoCronograma } from '../../../domain/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearCronogramaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idProyecto: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nombre: string;

  @IsEnum(EstadoCronograma)
  @ApiProperty()
  estadoInicial: EstadoCronograma;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  accionesAnteRetraso?: string;
}
