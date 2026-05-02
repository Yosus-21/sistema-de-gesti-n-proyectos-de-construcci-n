import { Injectable } from '@nestjs/common';
import { Prisma, Contrato as PrismaContratoRecord } from '@prisma/client';
import { Contrato } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  ContratoRepository,
  ContratoRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaContratoRepository
  extends PrismaRepositoryBase
  implements ContratoRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Contrato): Promise<Contrato> {
    const record = await this.prisma.contrato.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idContrato: number): Promise<Contrato | null> {
    const record = await this.prisma.contrato.findUnique({
      where: { idContrato },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: ContratoRepositoryFindManyParams,
  ): Promise<Contrato[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: ['idProyecto', 'idContratista'],
        searchFields: ['metodoPago', 'estadoContrato'],
      },
    );

    const records = await this.prisma.contrato.findMany({
      where: query.where as Prisma.ContratoWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idContrato: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(idContrato: number, data: Partial<Contrato>): Promise<Contrato> {
    const record = await this.prisma.contrato.update({
      where: { idContrato },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idContrato: number): Promise<void> {
    await this.prisma.contrato.delete({
      where: { idContrato },
    });
  }

  private toDomain(record: PrismaContratoRecord): Contrato {
    return new Contrato({
      idContrato: record.idContrato,
      fechaInicio: record.fechaInicio,
      fechaFin: record.fechaFin,
      costoTotal: record.costoTotal,
      metodoPago: record.metodoPago,
      terminosYCondiciones: record.terminosYCondiciones,
      estadoContrato: record.estadoContrato,
      idProyecto: record.idProyecto ?? undefined,
      idContratista: record.idContratista ?? undefined,
    });
  }

  private toCreatePersistence(
    data: Contrato,
  ): Prisma.ContratoUncheckedCreateInput {
    return {
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
      costoTotal: data.costoTotal,
      metodoPago: data.metodoPago,
      terminosYCondiciones: data.terminosYCondiciones,
      estadoContrato: data.estadoContrato,
      idProyecto: data.idProyecto,
      idContratista: data.idContratista,
    };
  }

  private toUpdatePersistence(
    data: Partial<Contrato>,
  ): Prisma.ContratoUncheckedUpdateInput {
    const persistenceData: Prisma.ContratoUncheckedUpdateInput = {
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
      costoTotal: data.costoTotal,
      metodoPago: data.metodoPago,
      terminosYCondiciones: data.terminosYCondiciones,
      estadoContrato: data.estadoContrato,
      idProyecto: data.idProyecto,
      idContratista: data.idContratista,
    };

    return this.omitUndefined(persistenceData);
  }
}
