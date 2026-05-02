import { Injectable } from '@nestjs/common';
import { Prisma, Cliente as PrismaClienteRecord } from '@prisma/client';
import { Cliente } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  ClienteRepository,
  ClienteRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaClienteRepository
  extends PrismaRepositoryBase
  implements ClienteRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Cliente): Promise<Cliente> {
    const record = await this.prisma.cliente.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idCliente: number): Promise<Cliente | null> {
    const record = await this.prisma.cliente.findUnique({
      where: { idCliente },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(params?: ClienteRepositoryFindManyParams): Promise<Cliente[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: [],
        searchFields: ['nombre', 'correo', 'telefono'],
      },
    );

    const records = await this.prisma.cliente.findMany({
      where: query.where as Prisma.ClienteWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idCliente: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(idCliente: number, data: Partial<Cliente>): Promise<Cliente> {
    const record = await this.prisma.cliente.update({
      where: { idCliente },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idCliente: number): Promise<void> {
    await this.prisma.cliente.delete({
      where: { idCliente },
    });
  }

  async existsByCorreoOrTelefono(
    correo: string,
    telefono: string,
  ): Promise<boolean> {
    const record = await this.prisma.cliente.findFirst({
      where: {
        OR: [{ correo }, { telefono }],
      },
      select: { idCliente: true },
    });

    return Boolean(record);
  }

  async existsByCorreoOrTelefonoExcludingId(
    correo: string,
    telefono: string,
    idCliente: number,
  ): Promise<boolean> {
    const record = await this.prisma.cliente.findFirst({
      where: {
        idCliente: {
          not: idCliente,
        },
        OR: [{ correo }, { telefono }],
      },
      select: { idCliente: true },
    });

    return Boolean(record);
  }

  private toDomain(record: PrismaClienteRecord): Cliente {
    return new Cliente({
      idCliente: record.idCliente,
      nombre: record.nombre,
      direccion: record.direccion,
      telefono: record.telefono,
      correo: record.correo,
      tipoCliente: record.tipoCliente,
    });
  }

  private toCreatePersistence(
    data: Cliente,
  ): Prisma.ClienteUncheckedCreateInput {
    return {
      nombre: data.nombre,
      direccion: data.direccion,
      telefono: data.telefono,
      correo: data.correo,
      tipoCliente: data.tipoCliente,
    };
  }

  private toUpdatePersistence(
    data: Partial<Cliente>,
  ): Prisma.ClienteUncheckedUpdateInput {
    const persistenceData: Prisma.ClienteUncheckedUpdateInput = {
      nombre: data.nombre,
      direccion: data.direccion,
      telefono: data.telefono,
      correo: data.correo,
      tipoCliente: data.tipoCliente,
    };

    return this.omitUndefined(persistenceData);
  }
}
