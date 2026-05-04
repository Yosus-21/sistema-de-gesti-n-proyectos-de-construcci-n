import {
  AdminSeedConfigError,
  DEFAULT_ADMIN_NOMBRE,
  parseAdminSeedConfig,
} from './admin-seed.util';

describe('admin-seed.util', () => {
  it('falla si ADMIN_EMAIL está vacío', () => {
    expect(() =>
      parseAdminSeedConfig({
        ADMIN_PASSWORD: 'AdminSeedPassword123!',
      }),
    ).toThrow(AdminSeedConfigError);
  });

  it('falla si ADMIN_PASSWORD tiene menos de 12 caracteres', () => {
    expect(() =>
      parseAdminSeedConfig({
        ADMIN_EMAIL: 'admin@suarq.local',
        ADMIN_PASSWORD: 'short',
      }),
    ).toThrow('ADMIN_PASSWORD debe tener al menos 12 caracteres.');
  });

  it('normaliza email y usa nombre por defecto', () => {
    const config = parseAdminSeedConfig({
      ADMIN_EMAIL: '  ADMIN@SUARQ.LOCAL  ',
      ADMIN_PASSWORD: 'AdminSeedPassword123!',
    });

    expect(config).toEqual({
      email: 'admin@suarq.local',
      password: 'AdminSeedPassword123!',
      nombre: DEFAULT_ADMIN_NOMBRE,
      overwritePassword: false,
    });
  });

  it('lee ADMIN_OVERWRITE_PASSWORD solo cuando es true explícito', () => {
    const config = parseAdminSeedConfig({
      ADMIN_EMAIL: 'admin@suarq.local',
      ADMIN_PASSWORD: 'AdminSeedPassword123!',
      ADMIN_NOMBRE: 'Admin Seed',
      ADMIN_OVERWRITE_PASSWORD: 'true',
    });

    expect(config).toEqual({
      email: 'admin@suarq.local',
      password: 'AdminSeedPassword123!',
      nombre: 'Admin Seed',
      overwritePassword: true,
    });
  });
});
