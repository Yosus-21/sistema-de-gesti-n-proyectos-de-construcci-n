import { Injectable } from '@nestjs/common';
import {
  EstadoProyecto as PrismaEstadoProyecto,
  Prisma,
  Proyecto as PrismaProyectoRecord,
} from '@prisma/client';
import { Proyecto } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  ProyectoRepository,
  ProyectoRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaProyectoRepository
  extends PrismaRepositoryBase
  implements ProyectoRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Proyecto): Promise<Proyecto> {
    const record = await this.prisma.proyecto.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idProyecto: number): Promise<Proyecto | null> {
    const record = await this.prisma.proyecto.findUnique({
      where: { idProyecto },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: ProyectoRepositoryFindManyParams,
  ): Promise<Proyecto[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: ['idCliente'],
        searchFields: ['nombre', 'descripcion', 'ubicacion'],
      },
    );

    const records = await this.prisma.proyecto.findMany({
      where: query.where as Prisma.ProyectoWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idProyecto: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(idProyecto: number, data: Partial<Proyecto>): Promise<Proyecto> {
    const record = await this.prisma.proyecto.update({
      where: { idProyecto },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idProyecto: number): Promise<void> {
    await this.prisma.proyecto.delete({
      where: { idProyecto },
    });
  }

  async existsActiveByCliente(idCliente: number): Promise<boolean> {
    const record = await this.prisma.proyecto.findFirst({
      where: {
        idCliente,
        estadoProyecto: {
          in: [
            PrismaEstadoProyecto.PLANIFICACION,
            PrismaEstadoProyecto.EN_EJECUCION,
            PrismaEstadoProyecto.PAUSADO,
          ],
        },
      },
      select: { idProyecto: true },
    });

    return Boolean(record);
  }

  private toDomain(record: PrismaProyectoRecord): Proyecto {
    return new Proyecto({
      idProyecto: record.idProyecto,
      nombre: record.nombre,
      descripcion: record.descripcion,
      ubicacion: record.ubicacion,
      presupuesto: record.presupuesto,
      fechaInicio: record.fechaInicio,
      fechaFinEstimada: record.fechaFinEstimada,
      estadoProyecto:
        record.estadoProyecto as unknown as Proyecto['estadoProyecto'],
      especificacionesTecnicas: record.especificacionesTecnicas,
      idCliente: record.idCliente ?? undefined,
    });
  }

  private toCreatePersistence(
    data: Proyecto,
  ): Prisma.ProyectoUncheckedCreateInput {
    return {
      nombre: data.nombre,
      descripcion: data.descripcion,
      ubicacion: data.ubicacion,
      presupuesto: data.presupuesto,
      fechaInicio: data.fechaInicio,
      fechaFinEstimada: data.fechaFinEstimada,
      estadoProyecto: data.estadoProyecto as unknown as PrismaEstadoProyecto,
      especificacionesTecnicas: data.especificacionesTecnicas,
      idCliente: data.idCliente,
    };
  }

  private toUpdatePersistence(
    data: Partial<Proyecto>,
  ): Prisma.ProyectoUncheckedUpdateInput {
    const persistenceData: Prisma.ProyectoUncheckedUpdateInput = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      ubicacion: data.ubicacion,
      presupuesto: data.presupuesto,
      fechaInicio: data.fechaInicio,
      fechaFinEstimada: data.fechaFinEstimada,
      estadoProyecto: data.estadoProyecto as unknown as
        | PrismaEstadoProyecto
        | undefined,
      especificacionesTecnicas: data.especificacionesTecnicas,
      idCliente: data.idCliente,
    };

    return this.omitUndefined(persistenceData);
  }
}
