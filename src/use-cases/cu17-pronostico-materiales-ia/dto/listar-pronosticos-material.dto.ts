import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListarPronosticosMaterialDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    example: 1,
    description: 'Filtra pronósticos por proyecto.',
  })
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    example: 3,
    description: 'Filtra pronósticos por material específico.',
  })
  idMaterial?: number;
}
