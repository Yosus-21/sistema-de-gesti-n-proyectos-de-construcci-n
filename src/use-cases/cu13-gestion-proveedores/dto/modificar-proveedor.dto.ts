import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModificarProveedorDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idProveedor: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  direccion?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  telefono?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  correo?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  terminosEntrega?: string;
}
