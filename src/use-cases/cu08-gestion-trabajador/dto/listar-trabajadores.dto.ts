import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto';
import { OcupacionTrabajador } from '../../../domain/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListarTrabajadoresDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OcupacionTrabajador)
  @ApiPropertyOptional()
  ocupacion?: OcupacionTrabajador;
}
