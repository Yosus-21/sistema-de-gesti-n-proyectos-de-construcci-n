export function parseBooleanEnv(
  value: string | undefined,
  defaultValue = false,
): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  return value.trim().toLowerCase() === 'true';
}

export function parseCsvEnv(value: string | undefined): string[] {
  return (
    value
      ?.split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0) ?? []
  );
}

export function parsePositiveIntEnv(
  value: string | undefined,
  defaultValue: number,
): number {
  const parsed = Number.parseInt(value ?? '', 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}

export const DEVELOPMENT_JWT_SECRET_FALLBACK = 'change_me_in_production';

const PRODUCTION_ENV = 'production';

const WEAK_JWT_SECRETS = new Set([
  '',
  '123456',
  'password',
  'secret',
  'changeme',
  'change-me',
  'change_me',
  'change-me-in-production',
  'change_me_in_production',
  'dev-secret',
  'development-secret',
  'test-secret',
  'jwt-secret',
  'jwt_secret',
]);

export function getNodeEnv(): string {
  return (process.env.NODE_ENV ?? 'development').trim().toLowerCase();
}

export function isProductionEnv(): boolean {
  return getNodeEnv() === PRODUCTION_ENV;
}

export function isWeakJwtSecret(secret: string | undefined): boolean {
  const normalizedSecret = (secret ?? '').trim().toLowerCase();

  return normalizedSecret.length < 32 || WEAK_JWT_SECRETS.has(normalizedSecret);
}

export function getJwtSecret(): string {
  const jwtSecret = process.env.JWT_SECRET?.trim();

  if (isProductionEnv()) {
    if (!jwtSecret) {
      throw new Error('JWT_SECRET es obligatorio cuando NODE_ENV=production.');
    }

    if (isWeakJwtSecret(jwtSecret)) {
      throw new Error(
        'JWT_SECRET debe ser fuerte en production: usa un valor aleatorio de al menos 32 caracteres y evita secretos por defecto.',
      );
    }

    return jwtSecret;
  }

  return jwtSecret || DEVELOPMENT_JWT_SECRET_FALLBACK;
}

export function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN ?? '1h';
}

export function isPublicRegistrationEnabled(): boolean {
  const enabled = parseBooleanEnv(
    process.env.AUTH_REGISTER_ENABLED,
    !isProductionEnv(),
  );

  if (isProductionEnv() && enabled) {
    throw new Error(
      'AUTH_REGISTER_ENABLED=true no está permitido cuando NODE_ENV=production. Crea el usuario ADMIN inicial por seed/manual controlado y mantén el registro público deshabilitado.',
    );
  }

  return enabled;
}

export function assertAuthEnvironmentPolicy(): void {
  getJwtSecret();
  isPublicRegistrationEnabled();
}
