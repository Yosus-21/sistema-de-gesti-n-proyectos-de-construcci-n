import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'admin@suarq.local',
    description: 'Correo del usuario registrado.',
  })
  correo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    example: 'Password123',
    description: 'Contraseña en texto plano para autenticación.',
    minLength: 8,
  })
  password: string;
}
