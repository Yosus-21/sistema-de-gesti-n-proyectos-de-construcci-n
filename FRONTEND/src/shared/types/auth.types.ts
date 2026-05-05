import type { Role } from './roles.types';

export interface User {
  idUsuario: number;
  nombre: string;
  correo: string;
  rol: Role;
  activo: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  correo: string;
  password: string;
}
