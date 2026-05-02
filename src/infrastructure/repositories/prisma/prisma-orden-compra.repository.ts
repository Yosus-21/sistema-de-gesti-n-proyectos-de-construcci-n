import { Injectable } from '@nestjs/common';
import {
  Prisma,
  OrdenCompra as PrismaOrdenCompraRecord,
  EstadoOrdenCompra as PrismaEstadoOrdenCompra,
  LineaOrdenCompra as PrismaLineaOrdenCompraRecord,
} from '@prisma/client';
import { LineaOrdenCompra, OrdenCompra } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  OrdenCompraRepository,
  OrdenCompraRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaOrdenCompraRepository
  extends PrismaRepositoryBase
  implements OrdenCompraRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: OrdenCompra): Promise<OrdenCompra> {
    const record = await this.prisma.ordenCompra.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idOrdenCompra: number): Promise<OrdenCompra | null> {
    const record = await this.prisma.ordenCompra.findUnique({
      where: { idOrdenCompra },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: OrdenCompraRepositoryFindManyParams,
  ): Promise<OrdenCompra[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: ['idProveedor', 'estadoOrden'],
        searchFields: [],
      },
    );

    const records = await this.prisma.ordenCompra.findMany({
      where: query.where as Prisma.OrdenCompraWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idOrdenCompra: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(
    idOrdenCompra: number,
    data: Partial<OrdenCompra>,
  ): Promise<OrdenCompra> {
    const record = await this.prisma.ordenCompra.update({
      where: { idOrdenCompra },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idOrdenCompra: number): Promise<void> {
    await this.prisma.ordenCompra.delete({
      where: { idOrdenCompra },
    });
  }

  async addLinea(data: LineaOrdenCompra): Promise<LineaOrdenCompra> {
    const record = await this.prisma.lineaOrdenCompra.create({
      data: this.toCreateLineaPersistence(data),
    });

    return this.toLineaDomain(record);
  }

  async findLineasByOrden(idOrdenCompra: number): Promise<LineaOrdenCompra[]> {
    const records = await this.prisma.lineaOrdenCompra.findMany({
      where: {
        idOrdenCompra,
      },
      orderBy: {
        idLineaOrdenCompra: 'asc',
      },
    });

    return records.map((record) => this.toLineaDomain(record));
  }

  async calcularMontoTotal(idOrdenCompra: number): Promise<number> {
    const lineas = await this.findLineasByOrden(idOrdenCompra);

    return lineas.reduce(
      (total, linea) =>
        total + linea.cantidadSolicitada * linea.precioUnitarioAcordado,
      0,
    );
  }

  private toDomain(record: PrismaOrdenCompraRecord): OrdenCompra {
    return new OrdenCompra({
      idOrdenCompra: record.idOrdenCompra,
      fechaOrden: record.fechaOrden,
      fechaEntregaEstimada: record.fechaEntregaEstimada ?? undefined,
      estadoOrden: record.estadoOrden as unknown as OrdenCompra['estadoOrden'],
      idProveedor: record.idProveedor ?? undefined,
    });
  }

  private toLineaDomain(
    record: PrismaLineaOrdenCompraRecord,
  ): LineaOrdenCompra {
    return new LineaOrdenCompra({
      idLineaOrdenCompra: record.idLineaOrdenCompra,
      cantidadSolicitada: record.cantidadSolicitada,
      precioUnitarioAcordado: record.precioUnitarioAcordado,
      estadoLinea: record.estadoLinea ?? undefined,
      idOrdenCompra: record.idOrdenCompra ?? undefined,
      idMaterial: record.idMaterial ?? undefined,
    });
  }

  private toCreatePersistence(
    data: OrdenCompra,
  ): Prisma.OrdenCompraUncheckedCreateInput {
    return {
      fechaOrden: data.fechaOrden,
      fechaEntregaEstimada: data.fechaEntregaEstimada,
      estadoOrden: data.estadoOrden as unknown as PrismaEstadoOrdenCompra,
      idProveedor: data.idProveedor,
    };
  }

  private toUpdatePersistence(
    data: Partial<OrdenCompra>,
  ): Prisma.OrdenCompraUncheckedUpdateInput {
    const persistenceData: Prisma.OrdenCompraUncheckedUpdateInput = {
      fechaOrden: data.fechaOrden,
      fechaEntregaEstimada: data.fechaEntregaEstimada,
      estadoOrden: data.estadoOrden as unknown as
        | PrismaEstadoOrdenCompra
        | undefined,
      idProveedor: data.idProveedor,
    };

    return this.omitUndefined(persistenceData);
  }

  private toCreateLineaPersistence(
    data: LineaOrdenCompra,
  ): Prisma.LineaOrdenCompraUncheckedCreateInput {
    return {
      cantidadSolicitada: data.cantidadSolicitada,
      precioUnitarioAcordado: data.precioUnitarioAcordado,
      estadoLinea: data.estadoLinea,
      idOrdenCompra: data.idOrdenCompra,
      idMaterial: data.idMaterial,
    };
  }
}
