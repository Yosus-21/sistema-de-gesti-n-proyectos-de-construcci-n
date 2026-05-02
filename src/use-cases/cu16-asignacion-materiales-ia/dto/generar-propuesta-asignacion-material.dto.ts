import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GenerarPropuestaAsignacionMaterialDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea?: number;

  @IsOptional()
  @IsString()
  criteriosPrioridad?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costoMaximoPermitido?: number;

  @IsOptional()
  @IsString()
  restricciones?: string;
}
