import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class AsignarTareaContratistaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTrabajador: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idContratista?: number;

  @IsDateString()
  fechaAsignacion: string;

  @IsString()
  @IsNotEmpty()
  rolEnLaTarea: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
