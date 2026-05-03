import { UnauthorizedException } from '@nestjs/common';
import { RolUsuario } from '../../domain';
import { AuthService } from '../auth.service';
import { AuthenticatedUser, JwtPayload } from '../types';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authServiceMock: jest.Mocked<Pick<AuthService, 'validateUser'>>;

  const payload: JwtPayload = {
    sub: 1,
    correo: 'admin@suarq.local',
    rol: RolUsuario.ADMIN,
  };

  beforeEach(() => {
    authServiceMock = {
      validateUser: jest.fn(),
    };

    strategy = new JwtStrategy(authServiceMock as unknown as AuthService);
  });

  it('valida usuario activo', async () => {
    const user: AuthenticatedUser = {
      idUsuario: 1,
      nombre: 'Admin SuArq',
      correo: payload.correo,
      rol: RolUsuario.ADMIN,
      activo: true,
    };

    authServiceMock.validateUser.mockResolvedValue(user);

    await expect(strategy.validate(payload)).resolves.toEqual(user);
    expect(authServiceMock.validateUser).toHaveBeenCalledWith(payload);
  });

  it('rechaza usuario inexistente', async () => {
    authServiceMock.validateUser.mockRejectedValue(
      new UnauthorizedException('Usuario autenticado no disponible.'),
    );

    await expect(strategy.validate(payload)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rechaza usuario inactivo', async () => {
    authServiceMock.validateUser.mockRejectedValue(
      new UnauthorizedException('Usuario autenticado no disponible.'),
    );

    await expect(strategy.validate(payload)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
