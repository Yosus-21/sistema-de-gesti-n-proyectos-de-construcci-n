import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AsignarTareaContratistaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idTarea: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idTrabajador: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idContratista?: number;

  @IsDateString()
  @ApiProperty()
  fechaAsignacion: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  rolEnLaTarea: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  observaciones?: string;
}
