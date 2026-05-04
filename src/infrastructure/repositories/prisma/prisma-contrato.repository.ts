import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Contrato as PrismaContratoRecord,
  ContratoDetalle as PrismaContratoDetalleRecord,
} from '@prisma/client';
import { Contrato, ContratoDetalle } from '../../../domain';
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
    const { detalles, ...restData } = data;
    const record = await this.prisma.contrato.create({
      data: {
        ...this.toCreatePersistence(restData as Contrato),
        ...(detalles && detalles.length > 0
          ? {
              detalles: {
                create: detalles.map((d) => ({
                  cantidadPersonas: d.cantidadPersonas,
                  costoUnitarioPorDia: d.costoUnitarioPorDia,
                  idCargo: d.idCargo,
                })),
              },
            }
          : {}),
      },
      include: { detalles: true },
    });

    return this.toDomain(record);
  }

  async findById(idContrato: number): Promise<Contrato | null> {
    const record = await this.prisma.contrato.findUnique({
      where: { idContrato },
      include: { detalles: true },
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
    const { detalles, ...restData } = data;

    return this.prisma.$transaction(async (tx) => {
      if (detalles) {
        await tx.contratoDetalle.deleteMany({ where: { idContrato } });
        if (detalles.length > 0) {
          await tx.contratoDetalle.createMany({
            data: detalles.map((d) => ({
              idContrato,
              cantidadPersonas: d.cantidadPersonas,
              costoUnitarioPorDia: d.costoUnitarioPorDia,
              idCargo: d.idCargo,
            })),
          });
        }
      }

      const record = await tx.contrato.update({
        where: { idContrato },
        data: this.toUpdatePersistence(restData),
        include: { detalles: true },
      });

      return this.toDomain(record);
    });
  }

  async delete(idContrato: number): Promise<void> {
    await this.prisma.contrato.delete({
      where: { idContrato },
    });
  }

  private toDomain(
    record: PrismaContratoRecord & { detalles?: PrismaContratoDetalleRecord[] },
  ): Contrato {
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
      detalles: record.detalles
        ? record.detalles.map(
            (d) =>
              new ContratoDetalle({
                idContratoDetalle: d.idContratoDetalle,
                cantidadPersonas: d.cantidadPersonas,
                costoUnitarioPorDia: d.costoUnitarioPorDia,
                idContrato: d.idContrato ?? undefined,
                idCargo: d.idCargo ?? undefined,
              }),
          )
        : undefined,
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
