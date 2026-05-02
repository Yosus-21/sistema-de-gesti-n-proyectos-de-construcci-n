import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto';
import { EstadoAlerta, TipoAlerta } from '../../../domain/enums';

export class ListarAlertasDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial?: number;

  @IsOptional()
  @IsEnum(TipoAlerta)
  tipoAlerta?: TipoAlerta;

  @IsOptional()
  @IsEnum(EstadoAlerta)
  estadoAlerta?: EstadoAlerta;
}
