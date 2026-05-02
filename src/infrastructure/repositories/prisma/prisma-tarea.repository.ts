import { Injectable } from '@nestjs/common';
import {
  EstadoTarea as PrismaEstadoTarea,
  OcupacionTrabajador as PrismaOcupacionTrabajador,
  Prisma,
  PrioridadTarea as PrismaPrioridadTarea,
  Tarea as PrismaTareaRecord,
  TipoTarea as PrismaTipoTarea,
} from '@prisma/client';
import { Tarea } from '../../../domain';
import { PrismaService } from '../../prisma';
import { TareaRepository, TareaRepositoryFindManyParams } from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaTareaRepository
  extends PrismaRepositoryBase
  implements TareaRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Tarea): Promise<Tarea> {
    const record = await this.prisma.tarea.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idTarea: number): Promise<Tarea | null> {
    const record = await this.prisma.tarea.findUnique({
      where: { idTarea },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(params?: TareaRepositoryFindManyParams): Promise<Tarea[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: ['idCronograma', 'tipoTarea', 'estadoTarea'],
        searchFields: ['nombre', 'descripcion'],
      },
    );

    const where = {
      ...(query.where as Prisma.TareaWhereInput | undefined),
      ...(params?.idProyecto !== undefined
        ? {
            cronograma: {
              idProyecto: params.idProyecto,
            },
          }
        : {}),
    };

    const records = await this.prisma.tarea.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idTarea: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(idTarea: number, data: Partial<Tarea>): Promise<Tarea> {
    const record = await this.prisma.tarea.update({
      where: { idTarea },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idTarea: number): Promise<void> {
    await this.prisma.tarea.delete({
      where: { idTarea },
    });
  }

  private toDomain(record: PrismaTareaRecord): Tarea {
    return new Tarea({
      idTarea: record.idTarea,
      nombre: record.nombre,
      descripcion: record.descripcion,
      tipoTarea: record.tipoTarea as unknown as Tarea['tipoTarea'],
      perfilRequerido:
        record.perfilRequerido as unknown as Tarea['perfilRequerido'],
      duracionEstimada: record.duracionEstimada,
      fechaInicioPlanificada: record.fechaInicioPlanificada,
      fechaFinPlanificada: record.fechaFinPlanificada,
      fechaInicioReal: record.fechaInicioReal ?? undefined,
      fechaFinReal: record.fechaFinReal ?? undefined,
      estadoTarea: record.estadoTarea as unknown as Tarea['estadoTarea'],
      prioridad: record.prioridad as unknown as Tarea['prioridad'],
      observaciones: record.observaciones ?? undefined,
      accionesAnteRetraso: record.accionesAnteRetraso ?? undefined,
      idCronograma: record.idCronograma ?? undefined,
    });
  }

  private toCreatePersistence(data: Tarea): Prisma.TareaUncheckedCreateInput {
    return {
      nombre: data.nombre,
      descripcion: data.descripcion,
      tipoTarea: data.tipoTarea as unknown as PrismaTipoTarea,
      perfilRequerido:
        data.perfilRequerido as unknown as PrismaOcupacionTrabajador,
      duracionEstimada: data.duracionEstimada,
      fechaInicioPlanificada: data.fechaInicioPlanificada,
      fechaFinPlanificada: data.fechaFinPlanificada,
      fechaInicioReal: data.fechaInicioReal,
      fechaFinReal: data.fechaFinReal,
      estadoTarea: data.estadoTarea as unknown as PrismaEstadoTarea,
      prioridad: data.prioridad as unknown as PrismaPrioridadTarea,
      observaciones: data.observaciones,
      accionesAnteRetraso: data.accionesAnteRetraso,
      idCronograma: data.idCronograma,
    };
  }

  private toUpdatePersistence(
    data: Partial<Tarea>,
  ): Prisma.TareaUncheckedUpdateInput {
    const persistenceData: Prisma.TareaUncheckedUpdateInput = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      tipoTarea: data.tipoTarea as unknown as PrismaTipoTarea | undefined,
      perfilRequerido: data.perfilRequerido as unknown as
        | PrismaOcupacionTrabajador
        | undefined,
      duracionEstimada: data.duracionEstimada,
      fechaInicioPlanificada: data.fechaInicioPlanificada,
      fechaFinPlanificada: data.fechaFinPlanificada,
      fechaInicioReal: data.fechaInicioReal,
      fechaFinReal: data.fechaFinReal,
      estadoTarea: data.estadoTarea as unknown as PrismaEstadoTarea | undefined,
      prioridad: data.prioridad as unknown as PrismaPrioridadTarea | undefined,
      observaciones: data.observaciones,
      accionesAnteRetraso: data.accionesAnteRetraso,
      idCronograma: data.idCronograma,
    };

    return this.omitUndefined(persistenceData);
  }
}
