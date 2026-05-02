import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ModificarAsignacionObraBrutaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idAsignacionTarea: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTrabajador?: number;

  @IsOptional()
  @IsDateString()
  fechaAsignacion?: string;

  @IsOptional()
  @IsString()
  rolEnLaTarea?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
