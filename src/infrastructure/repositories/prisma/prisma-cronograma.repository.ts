import { Injectable } from '@nestjs/common';
import {
  Cronograma as PrismaCronogramaRecord,
  EstadoCronograma as PrismaEstadoCronograma,
  Prisma,
} from '@prisma/client';
import { Cronograma } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  CronogramaRepository,
  CronogramaRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaCronogramaRepository
  extends PrismaRepositoryBase
  implements CronogramaRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Cronograma): Promise<Cronograma> {
    const record = await this.prisma.cronograma.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idCronograma: number): Promise<Cronograma | null> {
    const record = await this.prisma.cronograma.findUnique({
      where: { idCronograma },
    });

    return record ? this.toDomain(record) : null;
  }

  async findByProyecto(idProyecto: number): Promise<Cronograma | null> {
    const record = await this.prisma.cronograma.findUnique({
      where: { idProyecto },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: CronogramaRepositoryFindManyParams,
  ): Promise<Cronograma[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: ['idProyecto'],
        searchFields: ['nombre', 'motivoReplanificacion'],
      },
    );

    const records = await this.prisma.cronograma.findMany({
      where: query.where as Prisma.CronogramaWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idCronograma: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(
    idCronograma: number,
    data: Partial<Cronograma>,
  ): Promise<Cronograma> {
    const record = await this.prisma.cronograma.update({
      where: { idCronograma },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idCronograma: number): Promise<void> {
    await this.prisma.cronograma.delete({
      where: { idCronograma },
    });
  }

  async existsByProyecto(idProyecto: number): Promise<boolean> {
    const record = await this.prisma.cronograma.findUnique({
      where: { idProyecto },
      select: { idCronograma: true },
    });

    return Boolean(record);
  }

  private toDomain(record: PrismaCronogramaRecord): Cronograma {
    return new Cronograma({
      idCronograma: record.idCronograma,
      nombre: record.nombre,
      fechaCreacion: record.fechaCreacion,
      estadoCronograma:
        record.estadoCronograma as unknown as Cronograma['estadoCronograma'],
      fechaUltimaModificacion: record.fechaUltimaModificacion ?? undefined,
      motivoReplanificacion: record.motivoReplanificacion ?? undefined,
      accionesAnteRetraso: record.accionesAnteRetraso ?? undefined,
      idProyecto: record.idProyecto ?? undefined,
    });
  }

  private toCreatePersistence(
    data: Cronograma,
  ): Prisma.CronogramaUncheckedCreateInput {
    return {
      nombre: data.nombre,
      fechaCreacion: data.fechaCreacion,
      estadoCronograma:
        data.estadoCronograma as unknown as PrismaEstadoCronograma,
      fechaUltimaModificacion: data.fechaUltimaModificacion,
      motivoReplanificacion: data.motivoReplanificacion,
      accionesAnteRetraso: data.accionesAnteRetraso,
      idProyecto: data.idProyecto,
    };
  }

  private toUpdatePersistence(
    data: Partial<Cronograma>,
  ): Prisma.CronogramaUncheckedUpdateInput {
    const persistenceData: Prisma.CronogramaUncheckedUpdateInput = {
      nombre: data.nombre,
      fechaCreacion: data.fechaCreacion,
      estadoCronograma: data.estadoCronograma as unknown as
        | PrismaEstadoCronograma
        | undefined,
      fechaUltimaModificacion: data.fechaUltimaModificacion,
      motivoReplanificacion: data.motivoReplanificacion,
      accionesAnteRetraso: data.accionesAnteRetraso,
      idProyecto: data.idProyecto,
    };

    return this.omitUndefined(persistenceData);
  }
}
