import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto';
import { OcupacionTrabajador } from '../../../domain/enums';

export class ListarTrabajadoresDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OcupacionTrabajador)
  ocupacion?: OcupacionTrabajador;
}
