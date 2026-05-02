import { Injectable } from '@nestjs/common';
import { Prisma, Proveedor as PrismaProveedorRecord } from '@prisma/client';
import { Proveedor } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  ProveedorRepository,
  ProveedorRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaProveedorRepository
  extends PrismaRepositoryBase
  implements ProveedorRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Proveedor): Promise<Proveedor> {
    const record = await this.prisma.proveedor.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idProveedor: number): Promise<Proveedor | null> {
    const record = await this.prisma.proveedor.findUnique({
      where: { idProveedor },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: ProveedorRepositoryFindManyParams,
  ): Promise<Proveedor[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: [],
        searchFields: ['nombre', 'direccion', 'correo'],
      },
    );

    const records = await this.prisma.proveedor.findMany({
      where: query.where as Prisma.ProveedorWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idProveedor: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(
    idProveedor: number,
    data: Partial<Proveedor>,
  ): Promise<Proveedor> {
    const record = await this.prisma.proveedor.update({
      where: { idProveedor },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idProveedor: number): Promise<void> {
    await this.prisma.proveedor.delete({
      where: { idProveedor },
    });
  }

  async existsByNombreOrCorreo(
    nombre: string,
    correo: string,
  ): Promise<boolean> {
    const total = await this.prisma.proveedor.count({
      where: {
        OR: [{ nombre }, { correo }],
      },
    });

    return total > 0;
  }

  async existsByNombreOrCorreoExcludingId(
    nombre: string,
    correo: string,
    idProveedor: number,
  ): Promise<boolean> {
    const total = await this.prisma.proveedor.count({
      where: {
        idProveedor: {
          not: idProveedor,
        },
        OR: [{ nombre }, { correo }],
      },
    });

    return total > 0;
  }

  private toDomain(record: PrismaProveedorRecord): Proveedor {
    return new Proveedor({
      idProveedor: record.idProveedor,
      nombre: record.nombre,
      direccion: record.direccion,
      telefono: record.telefono,
      correo: record.correo,
      terminosEntrega: record.terminosEntrega ?? undefined,
    });
  }

  private toCreatePersistence(
    data: Proveedor,
  ): Prisma.ProveedorUncheckedCreateInput {
    return {
      nombre: data.nombre,
      direccion: data.direccion,
      telefono: data.telefono,
      correo: data.correo,
      terminosEntrega: data.terminosEntrega,
    };
  }

  private toUpdatePersistence(
    data: Partial<Proveedor>,
  ): Prisma.ProveedorUncheckedUpdateInput {
    const persistenceData: Prisma.ProveedorUncheckedUpdateInput = {
      nombre: data.nombre,
      direccion: data.direccion,
      telefono: data.telefono,
      correo: data.correo,
      terminosEntrega: data.terminosEntrega,
    };

    return this.omitUndefined(persistenceData);
  }
}
