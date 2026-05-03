import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
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

export class RegistrarContratoContratistaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idProyecto: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idContratista: number;

  @IsDateString()
  @ApiProperty()
  fechaInicio: string;

  @IsDateString()
  @ApiProperty()
  fechaFin: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  metodoPago: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  terminosYCondiciones: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleContratoContratistaDto)
  @ApiPropertyOptional()
  detalles?: DetalleContratoContratistaDto[];
}
