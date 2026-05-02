import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto';
import { TipoMaterial } from '../../../domain/enums';

export class ListarMaterialesDto extends PaginationDto {
  @IsOptional()
  @IsEnum(TipoMaterial)
  tipoMaterial?: TipoMaterial;
}
