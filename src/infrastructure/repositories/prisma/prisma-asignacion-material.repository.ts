import { Injectable } from '@nestjs/common';
import {
  Prisma,
  AsignacionMaterial as PrismaAsignacionMaterialRecord,
  EstadoAsignacion as PrismaEstadoAsignacion,
} from '@prisma/client';
import { AsignacionMaterial } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  AsignacionMaterialRepository,
  AsignacionMaterialRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaAsignacionMaterialRepository
  extends PrismaRepositoryBase
  implements AsignacionMaterialRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: AsignacionMaterial): Promise<AsignacionMaterial> {
    const record = await this.prisma.asignacionMaterial.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(
    idAsignacionMaterial: number,
  ): Promise<AsignacionMaterial | null> {
    const record = await this.prisma.asignacionMaterial.findUnique({
      where: { idAsignacionMaterial },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: AsignacionMaterialRepositoryFindManyParams,
  ): Promise<AsignacionMaterial[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: ['idTarea', 'idMaterial', 'estadoAsignacion'],
        searchFields: ['criteriosPrioridad', 'restricciones'],
      },
    );

    const records = await this.prisma.asignacionMaterial.findMany({
      where: query.where as Prisma.AsignacionMaterialWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idAsignacionMaterial: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(
    idAsignacionMaterial: number,
    data: Partial<AsignacionMaterial>,
  ): Promise<AsignacionMaterial> {
    const record = await this.prisma.asignacionMaterial.update({
      where: { idAsignacionMaterial },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idAsignacionMaterial: number): Promise<void> {
    await this.prisma.asignacionMaterial.delete({
      where: { idAsignacionMaterial },
    });
  }

  private toDomain(record: PrismaAsignacionMaterialRecord): AsignacionMaterial {
    return new AsignacionMaterial({
      idAsignacionMaterial: record.idAsignacionMaterial,
      cantidadAsignada: record.cantidadAsignada,
      fechaAsignacion: record.fechaAsignacion,
      criteriosPrioridad: record.criteriosPrioridad ?? undefined,
      costoMaximoPermitido: record.costoMaximoPermitido ?? undefined,
      restricciones: record.restricciones ?? undefined,
      estadoAsignacion:
        record.estadoAsignacion as unknown as AsignacionMaterial['estadoAsignacion'],
      generadaPorIa: record.generadaPorIa,
      idTarea: record.idTarea ?? undefined,
      idMaterial: record.idMaterial ?? undefined,
    });
  }

  private toCreatePersistence(
    data: AsignacionMaterial,
  ): Prisma.AsignacionMaterialUncheckedCreateInput {
    return {
      cantidadAsignada: data.cantidadAsignada,
      fechaAsignacion: data.fechaAsignacion,
      criteriosPrioridad: data.criteriosPrioridad,
      costoMaximoPermitido: data.costoMaximoPermitido,
      restricciones: data.restricciones,
      estadoAsignacion:
        data.estadoAsignacion as unknown as PrismaEstadoAsignacion,
      generadaPorIa: data.generadaPorIa,
      idTarea: data.idTarea,
      idMaterial: data.idMaterial,
    };
  }

  private toUpdatePersistence(
    data: Partial<AsignacionMaterial>,
  ): Prisma.AsignacionMaterialUncheckedUpdateInput {
    const persistenceData: Prisma.AsignacionMaterialUncheckedUpdateInput = {
      cantidadAsignada: data.cantidadAsignada,
      fechaAsignacion: data.fechaAsignacion,
      criteriosPrioridad: data.criteriosPrioridad,
      costoMaximoPermitido: data.costoMaximoPermitido,
      restricciones: data.restricciones,
      estadoAsignacion: data.estadoAsignacion as unknown as
        | PrismaEstadoAsignacion
        | undefined,
      generadaPorIa: data.generadaPorIa,
      idTarea: data.idTarea,
      idMaterial: data.idMaterial,
    };

    return this.omitUndefined(persistenceData);
  }
}
