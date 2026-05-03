import { ApiProperty } from '@nestjs/swagger';
import { RolUsuario } from '../../domain';

export class AuthUserDto {
  @ApiProperty({ example: 1 })
  idUsuario: number;

  @ApiProperty({ example: 'Administrador SuArq' })
  nombre: string;

  @ApiProperty({ example: 'admin@suarq.local' })
  correo: string;

  @ApiProperty({ enum: RolUsuario, example: RolUsuario.ADMIN })
  rol: RolUsuario;

  @ApiProperty({ example: true })
  activo: boolean;
}

export class AuthResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImNvcnJlbyI6ImFkbWluQHN1YXJxLmxvY2FsIiwicm9sIjoiQURNSU4ifQ.signature',
  })
  accessToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({
    example: '1h',
    description: 'Duración configurada para el access token.',
  })
  expiresIn: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
