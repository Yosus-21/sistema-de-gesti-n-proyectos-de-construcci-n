import type { Role } from './roles.types';

export interface User {
  idUsuario: number;
  email: string;
  nombre: string;
  rol: Role;
  activo: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  contrasena: string;
}
