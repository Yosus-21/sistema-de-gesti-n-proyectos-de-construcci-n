import { parseBooleanEnv } from './env.util';

export const ADMIN_PASSWORD_MIN_LENGTH = 12;
export const DEFAULT_ADMIN_NOMBRE = 'Administrador';

export interface AdminSeedConfig {
  email: string;
  password: string;
  nombre: string;
  overwritePassword: boolean;
}

export class AdminSeedConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdminSeedConfigError';
  }
}

export function parseAdminSeedConfig(
  env: NodeJS.ProcessEnv = process.env,
): AdminSeedConfig {
  const email = normalizeAdminEmail(env.ADMIN_EMAIL);
  const password = env.ADMIN_PASSWORD ?? '';
  const nombre = env.ADMIN_NOMBRE?.trim() || DEFAULT_ADMIN_NOMBRE;
  const overwritePassword = parseBooleanEnv(
    env.ADMIN_OVERWRITE_PASSWORD,
    false,
  );

  validateAdminEmail(email);
  validateAdminPassword(password);

  return {
    email,
    password,
    nombre,
    overwritePassword,
  };
}

export function normalizeAdminEmail(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? '';
}

export function validateAdminEmail(email: string): void {
  if (!email) {
    throw new AdminSeedConfigError('ADMIN_EMAIL es obligatorio.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AdminSeedConfigError('ADMIN_EMAIL debe tener formato de correo.');
  }
}

export function validateAdminPassword(password: string): void {
  if (!password) {
    throw new AdminSeedConfigError('ADMIN_PASSWORD es obligatorio.');
  }

  if (password.length < ADMIN_PASSWORD_MIN_LENGTH) {
    throw new AdminSeedConfigError(
      `ADMIN_PASSWORD debe tener al menos ${ADMIN_PASSWORD_MIN_LENGTH} caracteres.`,
    );
  }
}
