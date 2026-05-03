import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflectorMock: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;

  const context = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext;

  const parentPrototype = Object.getPrototypeOf(
    JwtAuthGuard.prototype,
  ) as JwtAuthGuard;

  beforeEach(() => {
    reflectorMock = {
      getAllAndOverride: jest.fn(),
    };

    guard = new JwtAuthGuard(reflectorMock as unknown as Reflector);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('permite endpoint público sin exigir JWT', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(true);
    const parentCanActivateSpy = jest.spyOn(parentPrototype, 'canActivate');

    expect(guard.canActivate(context)).toBe(true);
    expect(parentCanActivateSpy).not.toHaveBeenCalled();
  });

  it('exige JWT cuando el endpoint no es público', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);
    const parentCanActivateSpy = jest
      .spyOn(parentPrototype, 'canActivate')
      .mockImplementation(() => true);

    expect(guard.canActivate(context)).toBe(true);
    expect(parentCanActivateSpy).toHaveBeenCalledWith(context);
  });
});
