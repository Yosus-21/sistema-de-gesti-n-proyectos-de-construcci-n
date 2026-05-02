import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegistrarProveedorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  correo: string;

  @IsOptional()
  @IsString()
  terminosEntrega?: string;
}
