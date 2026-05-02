import { Injectable } from '@nestjs/common';
import { Prisma, Contratista as PrismaContratistaRecord } from '@prisma/client';
import { Contratista } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  ContratistaRepository,
  ContratistaRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaContratistaRepository
  extends PrismaRepositoryBase
  implements ContratistaRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Contratista): Promise<Contratista> {
    const record = await this.prisma.contratista.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idContratista: number): Promise<Contratista | null> {
    const record = await this.prisma.contratista.findUnique({
      where: { idContratista },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: ContratistaRepositoryFindManyParams,
  ): Promise<Contratista[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: [],
        searchFields: ['nombre', 'ci', 'empresa', 'correo'],
      },
    );

    const records = await this.prisma.contratista.findMany({
      where: query.where as Prisma.ContratistaWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idContratista: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async existsByCiOrCorreo(ci: string, correo: string): Promise<boolean> {
    const total = await this.prisma.contratista.count({
      where: {
        OR: [{ ci }, { correo }],
      },
    });

    return total > 0;
  }

  async existsByCiOrCorreoExcludingId(
    ci: string,
    correo: string,
    idContratista: number,
  ): Promise<boolean> {
    const total = await this.prisma.contratista.count({
      where: {
        idContratista: {
          not: idContratista,
        },
        OR: [{ ci }, { correo }],
      },
    });

    return total > 0;
  }

  async update(
    idContratista: number,
    data: Partial<Contratista>,
  ): Promise<Contratista> {
    const record = await this.prisma.contratista.update({
      where: { idContratista },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idContratista: number): Promise<void> {
    await this.prisma.contratista.delete({
      where: { idContratista },
    });
  }

  private toDomain(record: PrismaContratistaRecord): Contratista {
    return new Contratista({
      idContratista: record.idContratista,
      nombre: record.nombre,
      ci: record.ci,
      empresa: record.empresa ?? undefined,
      telefono: record.telefono,
      correo: record.correo,
    });
  }

  private toCreatePersistence(
    data: Contratista,
  ): Prisma.ContratistaUncheckedCreateInput {
    return {
      nombre: data.nombre,
      ci: data.ci,
      empresa: data.empresa,
      telefono: data.telefono,
      correo: data.correo,
    };
  }

  private toUpdatePersistence(
    data: Partial<Contratista>,
  ): Prisma.ContratistaUncheckedUpdateInput {
    const persistenceData: Prisma.ContratistaUncheckedUpdateInput = {
      nombre: data.nombre,
      ci: data.ci,
      empresa: data.empresa,
      telefono: data.telefono,
      correo: data.correo,
    };

    return this.omitUndefined(persistenceData);
  }
}
