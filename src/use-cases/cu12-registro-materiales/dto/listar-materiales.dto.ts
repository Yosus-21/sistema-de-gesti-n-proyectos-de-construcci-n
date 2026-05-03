import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto';
import { TipoMaterial } from '../../../domain/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListarMaterialesDto extends PaginationDto {
  @IsOptional()
  @IsEnum(TipoMaterial)
  @ApiPropertyOptional()
  tipoMaterial?: TipoMaterial;
}
