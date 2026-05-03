import { RolUsuario } from '../../domain';

export interface JwtPayload {
  sub: number;
  correo: string;
  rol: RolUsuario;
}
