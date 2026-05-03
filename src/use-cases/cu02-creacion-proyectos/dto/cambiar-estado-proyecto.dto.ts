import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';
import { EstadoProyecto } from '../../../domain/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CambiarEstadoProyectoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idProyecto: number;

  @IsEnum(EstadoProyecto)
  @ApiProperty()
  estadoProyecto: EstadoProyecto;
}
