import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto';

export class ListarAsignacionesObraFinaDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTrabajador?: number;
}
