import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConsultarClienteDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idCliente: number;
}
