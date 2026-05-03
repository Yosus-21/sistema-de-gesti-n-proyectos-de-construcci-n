import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Administrador SuArq',
    description: 'Nombre completo del usuario a registrar.',
  })
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'admin@suarq.local',
    description: 'Correo único del usuario.',
  })
  correo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    example: 'Password123',
    description:
      'Contraseña inicial del usuario. En backend se almacena solamente su hash.',
    minLength: 8,
  })
  password: string;
}
