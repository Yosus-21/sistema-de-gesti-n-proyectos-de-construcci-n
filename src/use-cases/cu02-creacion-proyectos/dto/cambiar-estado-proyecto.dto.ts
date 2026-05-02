import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';
import { EstadoProyecto } from '../../../domain/enums';

export class CambiarEstadoProyectoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto: number;

  @IsEnum(EstadoProyecto)
  estadoProyecto: EstadoProyecto;
}
