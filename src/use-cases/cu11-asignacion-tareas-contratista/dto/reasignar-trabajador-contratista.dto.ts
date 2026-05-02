import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ReasignarTrabajadorContratistaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idAsignacionTarea: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  idNuevoTrabajador: number;

  @IsOptional()
  @IsString()
  motivoReasignacion?: string;
}
