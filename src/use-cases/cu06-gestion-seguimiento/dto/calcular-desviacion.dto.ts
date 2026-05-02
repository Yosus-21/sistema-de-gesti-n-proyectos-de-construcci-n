import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CalcularDesviacionDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea: number;
}
