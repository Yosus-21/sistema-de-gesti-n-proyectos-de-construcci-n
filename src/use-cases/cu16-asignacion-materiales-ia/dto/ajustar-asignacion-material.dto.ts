import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AjustarAsignacionMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idAsignacionMaterial: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cantidadAsignada?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costoMaximoPermitido?: number;

  @IsOptional()
  @IsString()
  restricciones?: string;
}
