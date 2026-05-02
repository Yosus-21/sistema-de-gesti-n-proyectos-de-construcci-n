import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConsultarProyectoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto: number;
}
