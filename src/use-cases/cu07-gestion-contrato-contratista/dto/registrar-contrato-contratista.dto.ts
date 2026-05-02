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

export class RegistrarContratoContratistaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  idContratista: number;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;

  @IsString()
  @IsNotEmpty()
  metodoPago: string;

  @IsString()
  @IsNotEmpty()
  terminosYCondiciones: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleContratoContratistaDto)
  detalles?: DetalleContratoContratistaDto[];
}
