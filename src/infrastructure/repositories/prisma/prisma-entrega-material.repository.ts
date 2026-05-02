import { Injectable } from '@nestjs/common';
import {
  Prisma,
  EntregaMaterial as PrismaEntregaMaterialRecord,
} from '@prisma/client';
import { EntregaMaterial } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  EntregaMaterialRepository,
  EntregaMaterialRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaEntregaMaterialRepository
  extends PrismaRepositoryBase
  implements EntregaMaterialRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: EntregaMaterial): Promise<EntregaMaterial> {
    const record = await this.prisma.entregaMaterial.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idEntregaMaterial: number): Promise<EntregaMaterial | null> {
    const record = await this.prisma.entregaMaterial.findUnique({
      where: { idEntregaMaterial },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: EntregaMaterialRepositoryFindManyParams,
  ): Promise<EntregaMaterial[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: ['idOrdenCompra', 'idMaterial'],
        searchFields: ['estadoEntrega', 'observaciones'],
      },
    );

    const records = await this.prisma.entregaMaterial.findMany({
      where: query.where as Prisma.EntregaMaterialWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idEntregaMaterial: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(
    idEntregaMaterial: number,
    data: Partial<EntregaMaterial>,
  ): Promise<EntregaMaterial> {
    const record = await this.prisma.entregaMaterial.update({
      where: { idEntregaMaterial },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idEntregaMaterial: number): Promise<void> {
    await this.prisma.entregaMaterial.delete({
      where: { idEntregaMaterial },
    });
  }

  private toDomain(record: PrismaEntregaMaterialRecord): EntregaMaterial {
    return new EntregaMaterial({
      idEntregaMaterial: record.idEntregaMaterial,
      fechaEntrega: record.fechaEntrega,
      estadoEntrega: record.estadoEntrega,
      observaciones: record.observaciones ?? undefined,
      cantidadEntregada: record.cantidadEntregada,
      idOrdenCompra: record.idOrdenCompra ?? undefined,
      idMaterial: record.idMaterial ?? undefined,
    });
  }

  private toCreatePersistence(
    data: EntregaMaterial,
  ): Prisma.EntregaMaterialUncheckedCreateInput {
    return {
      fechaEntrega: data.fechaEntrega,
      estadoEntrega: data.estadoEntrega,
      observaciones: data.observaciones,
      cantidadEntregada: data.cantidadEntregada,
      idOrdenCompra: data.idOrdenCompra,
      idMaterial: data.idMaterial,
    };
  }

  private toUpdatePersistence(
    data: Partial<EntregaMaterial>,
  ): Prisma.EntregaMaterialUncheckedUpdateInput {
    const persistenceData: Prisma.EntregaMaterialUncheckedUpdateInput = {
      fechaEntrega: data.fechaEntrega,
      estadoEntrega: data.estadoEntrega,
      observaciones: data.observaciones,
      cantidadEntregada: data.cantidadEntregada,
      idOrdenCompra: data.idOrdenCompra,
      idMaterial: data.idMaterial,
    };

    return this.omitUndefined(persistenceData);
  }
}
