import { RolUsuario } from '../enums';

export class Usuario {
  idUsuario?: number;
  nombre: string;
  correo: string;
  passwordHash: string;
  rol: RolUsuario;
  activo: boolean;

  constructor(data: Partial<Usuario> = {}) {
    Object.assign(this, data);
  }
}
