import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConsultarAlertaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idAlerta: number;
}
