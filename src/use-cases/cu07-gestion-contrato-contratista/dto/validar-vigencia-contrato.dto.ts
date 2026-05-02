import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class ValidarVigenciaContratoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idContrato: number;

  @IsOptional()
  @IsDateString()
  fechaReferencia?: string;
}
