import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class AsignarTareaObraFinaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTrabajador: number;

  @IsDateString()
  fechaAsignacion: string;

  @IsString()
  @IsNotEmpty()
  rolEnLaTarea: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
