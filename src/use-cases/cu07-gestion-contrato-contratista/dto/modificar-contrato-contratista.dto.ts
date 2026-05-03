import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class DetalleContratoContratistaDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idCargo?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty()
  cantidadPersonas: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  costoUnitarioPorDia: number;
}

export class ModificarContratoContratistaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idContrato: number;

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
  idContratista?: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaFin?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  metodoPago?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  terminosYCondiciones?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleContratoContratistaDto)
  @ApiPropertyOptional()
  detalles?: DetalleContratoContratistaDto[];
}
