import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearProyectoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idCliente: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ubicacion: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  presupuesto: number;

  @IsDateString()
  @ApiProperty()
  fechaInicio: string;

  @IsDateString()
  @ApiProperty()
  fechaFinEstimada: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  especificacionesTecnicas: string;
}
