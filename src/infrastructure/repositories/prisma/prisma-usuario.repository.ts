import { Injectable } from '@nestjs/common';
import {
  Prisma,
  RolUsuario as PrismaRolUsuario,
  Usuario as PrismaUsuario,
} from '@prisma/client';
import { RolUsuario, Usuario } from '../../../domain';
import { PrismaService } from '../../prisma';
import { UsuarioRepository } from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaUsuarioRepository
  extends PrismaRepositoryBase
  implements UsuarioRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Usuario): Promise<Usuario> {
    const record = await this.prisma.usuario.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idUsuario: number): Promise<Usuario | null> {
    const record = await this.prisma.usuario.findUnique({
      where: { idUsuario },
    });

    return record ? this.toDomain(record) : null;
  }

  async findByCorreo(correo: string): Promise<Usuario | null> {
    const record = await this.prisma.usuario.findUnique({
      where: { correo },
    });

    return record ? this.toDomain(record) : null;
  }

  async update(idUsuario: number, data: Partial<Usuario>): Promise<Usuario> {
    const record = await this.prisma.usuario.update({
      where: { idUsuario },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  private toDomain(record: PrismaUsuario): Usuario {
    return new Usuario({
      idUsuario: record.idUsuario,
      nombre: record.nombre,
      correo: record.correo,
      passwordHash: record.passwordHash,
      rol: record.rol as RolUsuario,
      activo: record.activo,
    });
  }

  private toCreatePersistence(
    data: Usuario,
  ): Prisma.UsuarioUncheckedCreateInput {
    return {
      nombre: data.nombre,
      correo: data.correo,
      passwordHash: data.passwordHash,
      rol: data.rol as PrismaRolUsuario,
      activo: data.activo,
    };
  }

  private toUpdatePersistence(
    data: Partial<Usuario>,
  ): Prisma.UsuarioUncheckedUpdateInput {
    const persistenceData: Prisma.UsuarioUncheckedUpdateInput = {
      nombre: data.nombre,
      correo: data.correo,
      passwordHash: data.passwordHash,
      rol: data.rol as PrismaRolUsuario | undefined,
      activo: data.activo,
    };

    return this.omitUndefined(persistenceData);
  }
}
