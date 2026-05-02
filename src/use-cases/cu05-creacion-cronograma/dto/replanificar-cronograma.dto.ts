import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ReplanificarCronogramaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idCronograma: number;

  @IsString()
  @IsNotEmpty()
  motivoReplanificacion: string;

  @IsOptional()
  @IsString()
  nuevasAccionesAnteRetraso?: string;
}
