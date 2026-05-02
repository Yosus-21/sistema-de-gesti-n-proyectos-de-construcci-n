import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ValidarRestriccionesAsignacionMaterialDto {
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
  restricciones?: string;
}
