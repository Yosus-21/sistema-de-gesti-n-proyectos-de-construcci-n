import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Alerta as PrismaAlertaRecord,
  TipoAlerta as PrismaTipoAlerta,
  EstadoAlerta as PrismaEstadoAlerta,
  MetodoNotificacion as PrismaMetodoNotificacion,
} from '@prisma/client';
import { Alerta } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  AlertaRepository,
  AlertaRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaAlertaRepository
  extends PrismaRepositoryBase
  implements AlertaRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Alerta): Promise<Alerta> {
    const record = await this.prisma.alerta.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idAlerta: number): Promise<Alerta | null> {
    const record = await this.prisma.alerta.findUnique({
      where: { idAlerta },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(params?: AlertaRepositoryFindManyParams): Promise<Alerta[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: [
          'idProyecto',
          'idTarea',
          'idMaterial',
          'tipoAlerta',
          'estadoAlerta',
        ],
        searchFields: ['criterioActivacion', 'mensajeNotificacion'],
      },
    );

    const records = await this.prisma.alerta.findMany({
      where: query.where as Prisma.AlertaWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idAlerta: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(idAlerta: number, data: Partial<Alerta>): Promise<Alerta> {
    const record = await this.prisma.alerta.update({
      where: { idAlerta },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idAlerta: number): Promise<void> {
    await this.prisma.alerta.delete({
      where: { idAlerta },
    });
  }

  private toDomain(record: PrismaAlertaRecord): Alerta {
    return new Alerta({
      idAlerta: record.idAlerta,
      criterioActivacion: record.criterioActivacion,
      tipoAlerta: record.tipoAlerta as unknown as Alerta['tipoAlerta'],
      estadoAlerta: record.estadoAlerta as unknown as Alerta['estadoAlerta'],
      mensajeNotificacion: record.mensajeNotificacion ?? undefined,
      metodoNotificacion: (record.metodoNotificacion ??
        undefined) as unknown as Alerta['metodoNotificacion'],
      fechaGeneracion: record.fechaGeneracion ?? undefined,
      idProyecto: record.idProyecto ?? undefined,
      idTarea: record.idTarea ?? undefined,
      idMaterial: record.idMaterial ?? undefined,
    });
  }

  private toCreatePersistence(data: Alerta): Prisma.AlertaUncheckedCreateInput {
    return {
      criterioActivacion: data.criterioActivacion,
      tipoAlerta: data.tipoAlerta as unknown as PrismaTipoAlerta,
      estadoAlerta: data.estadoAlerta as unknown as PrismaEstadoAlerta,
      mensajeNotificacion: data.mensajeNotificacion,
      metodoNotificacion: (data.metodoNotificacion ?? undefined) as unknown as
        | PrismaMetodoNotificacion
        | undefined,
      fechaGeneracion: data.fechaGeneracion,
      idProyecto: data.idProyecto,
      idTarea: data.idTarea,
      idMaterial: data.idMaterial,
    };
  }

  private toUpdatePersistence(
    data: Partial<Alerta>,
  ): Prisma.AlertaUncheckedUpdateInput {
    const persistenceData: Prisma.AlertaUncheckedUpdateInput = {
      criterioActivacion: data.criterioActivacion,
      tipoAlerta: data.tipoAlerta as unknown as PrismaTipoAlerta | undefined,
      estadoAlerta: data.estadoAlerta as unknown as
        | PrismaEstadoAlerta
        | undefined,
      mensajeNotificacion: data.mensajeNotificacion,
      metodoNotificacion: data.metodoNotificacion as unknown as
        | PrismaMetodoNotificacion
        | undefined,
      fechaGeneracion: data.fechaGeneracion,
      idProyecto: data.idProyecto,
      idTarea: data.idTarea,
      idMaterial: data.idMaterial,
    };

    return this.omitUndefined(persistenceData);
  }
}
