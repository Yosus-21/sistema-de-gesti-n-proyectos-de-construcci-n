import { Type } from 'class-transformer';
import { IsDateString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerificarDisponibilidadTrabajadorDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idTrabajador: number;

  @IsDateString()
  @ApiProperty()
  fechaInicio: string;

  @IsDateString()
  @ApiProperty()
  fechaFin: string;
}
