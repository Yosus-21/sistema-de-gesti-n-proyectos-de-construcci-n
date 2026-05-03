import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../../domain';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflectorMock: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;

  const createExecutionContext = (user?: { rol?: RolUsuario }) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflectorMock = {
      getAllAndOverride: jest.fn(),
    };

    guard = new RolesGuard(reflectorMock as unknown as Reflector);
  });

  it('permite acceso si no hay roles requeridos', () => {
    reflectorMock.getAllAndOverride
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined);

    expect(guard.canActivate(createExecutionContext())).toBe(true);
  });

  it('permite acceso si el rol del usuario está permitido', () => {
    reflectorMock.getAllAndOverride
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce([RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO]);

    expect(
      guard.canActivate(
        createExecutionContext({ rol: RolUsuario.GESTOR_PROYECTO }),
      ),
    ).toBe(true);
  });

  it('bloquea si el rol del usuario no está permitido', () => {
    reflectorMock.getAllAndOverride
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce([RolUsuario.ADMIN]);

    expect(() =>
      guard.canActivate(createExecutionContext({ rol: RolUsuario.LECTOR })),
    ).toThrow(ForbiddenException);
  });

  it('bloquea si no existe user', () => {
    reflectorMock.getAllAndOverride
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce([RolUsuario.ADMIN]);

    expect(() => guard.canActivate(createExecutionContext())).toThrow(
      ForbiddenException,
    );
  });

  it('permite acceso en endpoint público aunque no exista user', () => {
    reflectorMock.getAllAndOverride.mockReturnValueOnce(true);

    expect(guard.canActivate(createExecutionContext())).toBe(true);
  });

  it('permite acceso a LECTOR cuando el método lo incluye', () => {
    reflectorMock.getAllAndOverride
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce([RolUsuario.ADMIN, RolUsuario.LECTOR]);

    expect(
      guard.canActivate(createExecutionContext({ rol: RolUsuario.LECTOR })),
    ).toBe(true);
  });
});
