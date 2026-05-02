import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ConsultarProveedorDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProveedor: number;
}
