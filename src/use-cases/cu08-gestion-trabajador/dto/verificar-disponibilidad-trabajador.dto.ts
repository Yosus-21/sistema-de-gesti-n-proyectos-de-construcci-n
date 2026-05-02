import { Type } from 'class-transformer';
import { IsDateString, IsInt, Min } from 'class-validator';

export class VerificarDisponibilidadTrabajadorDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTrabajador: number;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;
}
