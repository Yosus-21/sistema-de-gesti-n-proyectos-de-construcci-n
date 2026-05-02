import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Material as PrismaMaterialRecord,
  TipoMaterial as PrismaTipoMaterial,
} from '@prisma/client';
import { Material } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  MaterialRepository,
  MaterialRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaMaterialRepository
  extends PrismaRepositoryBase
  implements MaterialRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Material): Promise<Material> {
    const record = await this.prisma.material.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idMaterial: number): Promise<Material | null> {
    const record = await this.prisma.material.findUnique({
      where: { idMaterial },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: MaterialRepositoryFindManyParams,
  ): Promise<Material[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: ['tipoMaterial'],
        searchFields: ['nombre', 'descripcion', 'unidad'],
      },
    );

    const records = await this.prisma.material.findMany({
      where: query.where as Prisma.MaterialWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idMaterial: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async existsByNombre(nombre: string): Promise<boolean> {
    const total = await this.prisma.material.count({
      where: { nombre },
    });

    return total > 0;
  }

  async existsByNombreExcludingId(
    nombre: string,
    idMaterial: number,
  ): Promise<boolean> {
    const total = await this.prisma.material.count({
      where: {
        idMaterial: {
          not: idMaterial,
        },
        nombre,
      },
    });

    return total > 0;
  }

  async update(idMaterial: number, data: Partial<Material>): Promise<Material> {
    const record = await this.prisma.material.update({
      where: { idMaterial },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idMaterial: number): Promise<void> {
    await this.prisma.material.delete({
      where: { idMaterial },
    });
  }

  private toDomain(record: PrismaMaterialRecord): Material {
    return new Material({
      idMaterial: record.idMaterial,
      nombre: record.nombre,
      descripcion: record.descripcion,
      tipoMaterial: record.tipoMaterial as unknown as Material['tipoMaterial'],
      unidad: record.unidad,
      cantidadDisponible: record.cantidadDisponible,
      costoUnitario: record.costoUnitario,
      especificacionesTecnicas: record.especificacionesTecnicas ?? undefined,
    });
  }

  private toCreatePersistence(
    data: Material,
  ): Prisma.MaterialUncheckedCreateInput {
    return {
      nombre: data.nombre,
      descripcion: data.descripcion,
      tipoMaterial: data.tipoMaterial as unknown as PrismaTipoMaterial,
      unidad: data.unidad,
      cantidadDisponible: data.cantidadDisponible,
      costoUnitario: data.costoUnitario,
      especificacionesTecnicas: data.especificacionesTecnicas,
    };
  }

  private toUpdatePersistence(
    data: Partial<Material>,
  ): Prisma.MaterialUncheckedUpdateInput {
    const persistenceData: Prisma.MaterialUncheckedUpdateInput = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      tipoMaterial: data.tipoMaterial as unknown as
        | PrismaTipoMaterial
        | undefined,
      unidad: data.unidad,
      cantidadDisponible: data.cantidadDisponible,
      costoUnitario: data.costoUnitario,
      especificacionesTecnicas: data.especificacionesTecnicas,
    };

    return this.omitUndefined(persistenceData);
  }
}
