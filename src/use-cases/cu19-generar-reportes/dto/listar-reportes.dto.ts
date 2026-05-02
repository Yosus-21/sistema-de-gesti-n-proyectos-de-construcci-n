import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto';
import { TipoReporte } from '../../../domain/enums';

export class ListarReportesDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto?: number;

  @IsOptional()
  @IsEnum(TipoReporte)
  tipoReporte?: TipoReporte;
}
