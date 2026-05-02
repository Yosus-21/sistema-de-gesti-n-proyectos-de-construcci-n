import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ValidarProveedorDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProveedor: number;
}
