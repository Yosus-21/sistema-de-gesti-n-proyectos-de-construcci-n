import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrarProveedorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  correo: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  terminosEntrega?: string;
}
