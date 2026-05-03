import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListarAsignacionesMaterialDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    example: 1,
    description:
      'Filtra asignaciones de materiales por proyecto cuando la relación está disponible.',
  })
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    example: 10,
    description: 'Filtra asignaciones por tarea específica.',
  })
  idTarea?: number;
}
