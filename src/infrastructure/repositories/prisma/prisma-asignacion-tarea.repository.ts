import { Injectable } from '@nestjs/common';
import {
  AsignacionTarea as PrismaAsignacionTareaRecord,
  EstadoAsignacion as PrismaEstadoAsignacion,
  Prisma,
} from '@prisma/client';
import { AsignacionTarea } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  AsignacionTareaRepository,
  AsignacionTareaRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaAsignacionTareaRepository
  extends PrismaRepositoryBase
  implements AsignacionTareaRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: AsignacionTarea): Promise<AsignacionTarea> {
    const record = await this.prisma.asignacionTarea.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idAsignacionTarea: number): Promise<AsignacionTarea | null> {
    const record = await this.prisma.asignacionTarea.findUnique({
      where: { idAsignacionTarea },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: AsignacionTareaRepositoryFindManyParams,
  ): Promise<AsignacionTarea[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: [
          'idTarea',
          'idTrabajador',
          'estadoAsignacion',
          'asignadaPorContratista',
        ],
        searchFields: ['rolEnLaTarea', 'observaciones'],
      },
    );

    const records = await this.prisma.asignacionTarea.findMany({
      where: query.where as Prisma.AsignacionTareaWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idAsignacionTarea: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async existsActiveAssignment(
    idTarea: number,
    idTrabajador: number,
  ): Promise<boolean> {
    const total = await this.prisma.asignacionTarea.count({
      where: {
        idTarea,
        idTrabajador,
        estadoAsignacion: {
          not: PrismaEstadoAsignacion.CANCELADA,
        },
      },
    });

    return total > 0;
  }

  async update(
    idAsignacionTarea: number,
    data: Partial<AsignacionTarea>,
  ): Promise<AsignacionTarea> {
    const record = await this.prisma.asignacionTarea.update({
      where: { idAsignacionTarea },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idAsignacionTarea: number): Promise<void> {
    await this.prisma.asignacionTarea.delete({
      where: { idAsignacionTarea },
    });
  }

  private toDomain(record: PrismaAsignacionTareaRecord): AsignacionTarea {
    return new AsignacionTarea({
      idAsignacionTarea: record.idAsignacionTarea,
      fechaAsignacion: record.fechaAsignacion,
      rolEnLaTarea: record.rolEnLaTarea,
      estadoAsignacion:
        record.estadoAsignacion as unknown as AsignacionTarea['estadoAsignacion'],
      observaciones: record.observaciones ?? undefined,
      asignadaPorContratista: record.asignadaPorContratista,
      idTarea: record.idTarea ?? undefined,
      idTrabajador: record.idTrabajador ?? undefined,
    });
  }

  private toCreatePersistence(
    data: AsignacionTarea,
  ): Prisma.AsignacionTareaUncheckedCreateInput {
    return {
      fechaAsignacion: data.fechaAsignacion,
      rolEnLaTarea: data.rolEnLaTarea,
      estadoAsignacion:
        data.estadoAsignacion as unknown as PrismaEstadoAsignacion,
      observaciones: data.observaciones,
      asignadaPorContratista: data.asignadaPorContratista,
      idTarea: data.idTarea,
      idTrabajador: data.idTrabajador,
    };
  }

  private toUpdatePersistence(
    data: Partial<AsignacionTarea>,
  ): Prisma.AsignacionTareaUncheckedUpdateInput {
    const persistenceData: Prisma.AsignacionTareaUncheckedUpdateInput = {
      fechaAsignacion: data.fechaAsignacion,
      rolEnLaTarea: data.rolEnLaTarea,
      estadoAsignacion: data.estadoAsignacion as unknown as
        | PrismaEstadoAsignacion
        | undefined,
      observaciones: data.observaciones,
      asignadaPorContratista: data.asignadaPorContratista,
      idTarea: data.idTarea,
      idTrabajador: data.idTrabajador,
    };

    return this.omitUndefined(persistenceData);
  }
}
