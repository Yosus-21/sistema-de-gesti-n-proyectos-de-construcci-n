import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReasignarTrabajadorContratistaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idAsignacionTarea: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idNuevoTrabajador: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  motivoReasignacion?: string;
}
