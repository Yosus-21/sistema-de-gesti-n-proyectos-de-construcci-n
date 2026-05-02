import { Injectable } from '@nestjs/common';
import { Prisma, Seguimiento as PrismaSeguimientoRecord } from '@prisma/client';
import { Seguimiento } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  SeguimientoRepository,
  SeguimientoRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaSeguimientoRepository
  extends PrismaRepositoryBase
  implements SeguimientoRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Seguimiento): Promise<Seguimiento> {
    const record = await this.prisma.seguimiento.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idSeguimiento: number): Promise<Seguimiento | null> {
    const record = await this.prisma.seguimiento.findUnique({
      where: { idSeguimiento },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: SeguimientoRepositoryFindManyParams,
  ): Promise<Seguimiento[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: ['idTarea'],
        searchFields: ['estadoReportado', 'observaciones'],
      },
    );

    const records = await this.prisma.seguimiento.findMany({
      where: query.where as Prisma.SeguimientoWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idSeguimiento: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(
    idSeguimiento: number,
    data: Partial<Seguimiento>,
  ): Promise<Seguimiento> {
    const record = await this.prisma.seguimiento.update({
      where: { idSeguimiento },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idSeguimiento: number): Promise<void> {
    await this.prisma.seguimiento.delete({
      where: { idSeguimiento },
    });
  }

  private toDomain(record: PrismaSeguimientoRecord): Seguimiento {
    return new Seguimiento({
      idSeguimiento: record.idSeguimiento,
      fechaSeguimiento: record.fechaSeguimiento,
      estadoReportado: record.estadoReportado,
      cantidadMaterialUsado: record.cantidadMaterialUsado,
      observaciones: record.observaciones ?? undefined,
      porcentajeAvance: record.porcentajeAvance,
      idTarea: record.idTarea ?? undefined,
    });
  }

  private toCreatePersistence(
    data: Seguimiento,
  ): Prisma.SeguimientoUncheckedCreateInput {
    return {
      fechaSeguimiento: data.fechaSeguimiento,
      estadoReportado: data.estadoReportado,
      cantidadMaterialUsado: data.cantidadMaterialUsado,
      observaciones: data.observaciones,
      porcentajeAvance: data.porcentajeAvance,
      idTarea: data.idTarea,
    };
  }

  private toUpdatePersistence(
    data: Partial<Seguimiento>,
  ): Prisma.SeguimientoUncheckedUpdateInput {
    const persistenceData: Prisma.SeguimientoUncheckedUpdateInput = {
      fechaSeguimiento: data.fechaSeguimiento,
      estadoReportado: data.estadoReportado,
      cantidadMaterialUsado: data.cantidadMaterialUsado,
      observaciones: data.observaciones,
      porcentajeAvance: data.porcentajeAvance,
      idTarea: data.idTarea,
    };

    return this.omitUndefined(persistenceData);
  }
}
