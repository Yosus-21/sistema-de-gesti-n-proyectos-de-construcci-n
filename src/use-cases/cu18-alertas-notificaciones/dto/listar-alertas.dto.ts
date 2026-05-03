import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto';
import { EstadoAlerta, TipoAlerta } from '../../../domain/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListarAlertasDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idTarea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idMaterial?: number;

  @IsOptional()
  @IsEnum(TipoAlerta)
  @ApiPropertyOptional()
  tipoAlerta?: TipoAlerta;

  @IsOptional()
  @IsEnum(EstadoAlerta)
  @ApiPropertyOptional()
  estadoAlerta?: EstadoAlerta;
}
