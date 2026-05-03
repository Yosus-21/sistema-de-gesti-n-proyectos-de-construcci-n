import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RolUsuario, Usuario } from '../domain';
import type { UsuarioRepository } from '../infrastructure';
import { LoginDto, RegisterUserDto } from './dto';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usuarioRepositoryMock: jest.Mocked<UsuarioRepository>;
  let jwtServiceMock: jest.Mocked<Pick<JwtService, 'signAsync'>>;
  const originalAuthRegisterEnabled = process.env.AUTH_REGISTER_ENABLED;

  const registerDto: RegisterUserDto = {
    nombre: 'Admin Test',
    correo: 'admin-test@example.com',
    password: 'Password123',
  };

  const loginDto: LoginDto = {
    correo: 'admin-test@example.com',
    password: 'Password123',
  };

  beforeEach(() => {
    process.env.AUTH_REGISTER_ENABLED = 'true';

    usuarioRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCorreo: jest.fn(),
      update: jest.fn(),
    };

    jwtServiceMock = {
      signAsync: jest.fn(),
    };

    service = new AuthService(
      usuarioRepositoryMock,
      jwtServiceMock as unknown as JwtService,
    );
  });

  afterEach(() => {
    if (originalAuthRegisterEnabled === undefined) {
      delete process.env.AUTH_REGISTER_ENABLED;
      return;
    }

    process.env.AUTH_REGISTER_ENABLED = originalAuthRegisterEnabled;
  });

  it('registra usuario correctamente', async () => {
    usuarioRepositoryMock.findByCorreo.mockResolvedValue(null);
    usuarioRepositoryMock.create.mockImplementation((user) => {
      return new Usuario({
        ...user,
        idUsuario: 1,
      });
    });

    const result = await service.register(registerDto);

    expect(usuarioRepositoryMock.findByCorreo).toHaveBeenCalledWith(
      registerDto.correo,
    );
    expect(usuarioRepositoryMock.create).toHaveBeenCalledTimes(1);

    const createdUser = usuarioRepositoryMock.create.mock.calls[0][0];
    expect(createdUser.nombre).toBe(registerDto.nombre);
    expect(createdUser.correo).toBe(registerDto.correo);
    expect(createdUser.rol).toBe(RolUsuario.ADMIN);
    expect(createdUser.activo).toBe(true);
    expect(createdUser.passwordHash).not.toBe(registerDto.password);
    await expect(
      bcrypt.compare(registerDto.password, createdUser.passwordHash),
    ).resolves.toBe(true);

    expect(result).toEqual({
      idUsuario: 1,
      nombre: registerDto.nombre,
      correo: registerDto.correo,
      rol: RolUsuario.ADMIN,
      activo: true,
    });
  });

  it('lanza ConflictException si correo ya existe', async () => {
    usuarioRepositoryMock.findByCorreo.mockResolvedValue(
      new Usuario({
        idUsuario: 1,
        nombre: 'Existente',
        correo: registerDto.correo,
        passwordHash: 'hash',
        rol: RolUsuario.ADMIN,
        activo: true,
      }),
    );

    await expect(service.register(registerDto)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(usuarioRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('bloquea registro si AUTH_REGISTER_ENABLED=false', async () => {
    process.env.AUTH_REGISTER_ENABLED = 'false';

    await expect(service.register(registerDto)).rejects.toBeInstanceOf(
      ForbiddenException,
    );

    expect(usuarioRepositoryMock.findByCorreo).not.toHaveBeenCalled();
    expect(usuarioRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('retorna token con credenciales válidas', async () => {
    const passwordHash = await bcrypt.hash(loginDto.password, 4);
    usuarioRepositoryMock.findByCorreo.mockResolvedValue(
      new Usuario({
        idUsuario: 7,
        nombre: 'Admin Test',
        correo: loginDto.correo,
        passwordHash,
        rol: RolUsuario.ADMIN,
        activo: true,
      }),
    );
    jwtServiceMock.signAsync.mockResolvedValue('signed.jwt.token');

    const result = await service.login(loginDto);

    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
      sub: 7,
      correo: loginDto.correo,
      rol: RolUsuario.ADMIN,
    });
    expect(result).toEqual({
      accessToken: 'signed.jwt.token',
      tokenType: 'Bearer',
      expiresIn: '1h',
      user: {
        idUsuario: 7,
        nombre: 'Admin Test',
        correo: loginDto.correo,
        rol: RolUsuario.ADMIN,
        activo: true,
      },
    });
  });

  it('lanza UnauthorizedException si usuario no existe', async () => {
    usuarioRepositoryMock.findByCorreo.mockResolvedValue(null);

    await expect(service.login(loginDto)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
  });

  it('lanza UnauthorizedException si password es incorrecto', async () => {
    const passwordHash = await bcrypt.hash('OtraPassword123', 4);
    usuarioRepositoryMock.findByCorreo.mockResolvedValue(
      new Usuario({
        idUsuario: 7,
        nombre: 'Admin Test',
        correo: loginDto.correo,
        passwordHash,
        rol: RolUsuario.ADMIN,
        activo: true,
      }),
    );

    await expect(service.login(loginDto)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
  });

  it('lanza UnauthorizedException si usuario está inactivo', async () => {
    usuarioRepositoryMock.findByCorreo.mockResolvedValue(
      new Usuario({
        idUsuario: 7,
        nombre: 'Admin Test',
        correo: loginDto.correo,
        passwordHash: 'hash',
        rol: RolUsuario.ADMIN,
        activo: false,
      }),
    );

    await expect(service.login(loginDto)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
  });
});
