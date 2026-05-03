import { Usuario } from '../../../domain';

export interface UsuarioRepository {
  create: (data: Usuario) => Promise<Usuario>;
  findById: (idUsuario: number) => Promise<Usuario | null>;
  findByCorreo: (correo: string) => Promise<Usuario | null>;
  update: (idUsuario: number, data: Partial<Usuario>) => Promise<Usuario>;
}
