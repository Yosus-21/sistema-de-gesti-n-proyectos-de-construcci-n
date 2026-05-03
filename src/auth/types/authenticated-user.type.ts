import { RolUsuario } from '../../domain';

export interface AuthenticatedUser {
  idUsuario: number;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  activo: boolean;
}
