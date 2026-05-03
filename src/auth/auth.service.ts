import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { parseBooleanEnv, parsePositiveIntEnv } from '../common';
import { RolUsuario, Usuario } from '../domain';
import { USUARIO_REPOSITORY, type UsuarioRepository } from '../infrastructure';
import { AuthResponseDto, AuthUserDto, LoginDto, RegisterUserDto } from './dto';
import { AuthenticatedUser, JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<AuthUserDto> {
    if (!parseBooleanEnv(process.env.AUTH_REGISTER_ENABLED, true)) {
      throw new ForbiddenException(
        'El registro público de usuarios está deshabilitado.',
      );
    }

    const existingUser = await this.usuarioRepository.findByCorreo(dto.correo);

    if (existingUser) {
      throw new ConflictException(
        'Ya existe un usuario registrado con el mismo correo.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, this.getSaltRounds());
    const user = new Usuario({
      nombre: dto.nombre,
      correo: dto.correo,
      passwordHash,
      rol: RolUsuario.ADMIN,
      activo: true,
    });

    const createdUser = await this.usuarioRepository.create(user);

    return this.toPublicUser(createdUser);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usuarioRepository.findByCorreo(dto.correo);

    if (!user || !user.activo) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const payload: JwtPayload = {
      sub: user.idUsuario as number,
      correo: user.correo,
      rol: user.rol,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
      user: this.toPublicUser(user),
    };
  }

  async validateUser(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.usuarioRepository.findById(payload.sub);

    if (!user || !user.activo) {
      throw new UnauthorizedException('Usuario autenticado no disponible.');
    }

    return this.toPublicUser(user);
  }

  private toPublicUser(user: Usuario): AuthenticatedUser {
    return {
      idUsuario: user.idUsuario as number,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
      activo: user.activo,
    };
  }

  private getSaltRounds(): number {
    return parsePositiveIntEnv(process.env.BCRYPT_SALT_ROUNDS, 10);
  }
}
