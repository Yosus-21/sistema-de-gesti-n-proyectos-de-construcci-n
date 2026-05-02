import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto';

export class ListarEntregasMaterialDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idOrdenCompra?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial?: number;
}
