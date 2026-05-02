import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class EliminarProveedorDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProveedor: number;
}
