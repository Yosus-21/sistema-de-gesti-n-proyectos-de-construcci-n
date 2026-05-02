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

class DetalleContratoContratistaDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idCargo?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  cantidadPersonas: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costoUnitarioPorDia: number;
}

export class ModificarContratoContratistaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idContrato: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idContratista?: number;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsString()
  metodoPago?: string;

  @IsOptional()
  @IsString()
  terminosYCondiciones?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleContratoContratistaDto)
  detalles?: DetalleContratoContratistaDto[];
}
