import {
  assertAuthEnvironmentPolicy,
  DEVELOPMENT_JWT_SECRET_FALLBACK,
  getJwtSecret,
  isPublicRegistrationEnabled,
} from './env.util';

describe('env.util security policy', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalJwtSecret = process.env.JWT_SECRET;
  const originalAuthRegisterEnabled = process.env.AUTH_REGISTER_ENABLED;

  const restoreEnv = () => {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }

    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }

    if (originalAuthRegisterEnabled === undefined) {
      delete process.env.AUTH_REGISTER_ENABLED;
    } else {
      process.env.AUTH_REGISTER_ENABLED = originalAuthRegisterEnabled;
    }
  };

  beforeEach(() => {
    delete process.env.NODE_ENV;
    delete process.env.JWT_SECRET;
    delete process.env.AUTH_REGISTER_ENABLED;
  });

  afterEach(() => {
    restoreEnv();
  });

  it('falla en production sin JWT_SECRET', () => {
    process.env.NODE_ENV = 'production';

    expect(() => getJwtSecret()).toThrow(
      'JWT_SECRET es obligatorio cuando NODE_ENV=production.',
    );
  });

  it('falla en production con JWT_SECRET débil', () => {
    process.env.NODE_ENV = 'production';
    process.env.JWT_SECRET = 'dev-secret';

    expect(() => getJwtSecret()).toThrow(
      'JWT_SECRET debe ser fuerte en production',
    );
  });

  it('acepta JWT_SECRET fuerte en production', () => {
    process.env.NODE_ENV = 'production';
    process.env.JWT_SECRET =
      'suarq-production-jwt-secret-with-64-random-like-characters';

    expect(getJwtSecret()).toBe(
      'suarq-production-jwt-secret-with-64-random-like-characters',
    );
  });

  it('falla en production si AUTH_REGISTER_ENABLED=true', () => {
    process.env.NODE_ENV = 'production';
    process.env.JWT_SECRET =
      'suarq-production-jwt-secret-with-64-random-like-characters';
    process.env.AUTH_REGISTER_ENABLED = 'true';

    expect(() => assertAuthEnvironmentPolicy()).toThrow(
      'AUTH_REGISTER_ENABLED=true no está permitido',
    );
  });

  it('permite bootstrap en development y test', () => {
    process.env.NODE_ENV = 'development';
    process.env.AUTH_REGISTER_ENABLED = 'true';

    expect(getJwtSecret()).toBe(DEVELOPMENT_JWT_SECRET_FALLBACK);
    expect(isPublicRegistrationEnabled()).toBe(true);

    process.env.NODE_ENV = 'test';

    expect(getJwtSecret()).toBe(DEVELOPMENT_JWT_SECRET_FALLBACK);
    expect(isPublicRegistrationEnabled()).toBe(true);
  });
});
