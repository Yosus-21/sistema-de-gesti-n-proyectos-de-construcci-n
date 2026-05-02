import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto';

export class ListarPronosticosMaterialDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial?: number;
}
