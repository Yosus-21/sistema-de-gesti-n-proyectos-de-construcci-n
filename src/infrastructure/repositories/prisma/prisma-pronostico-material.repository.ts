import { Injectable } from '@nestjs/common';
import {
  Prisma,
  PronosticoMaterial as PrismaPronosticoMaterialRecord,
} from '@prisma/client';
import { PronosticoMaterial } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  PronosticoMaterialRepository,
  PronosticoMaterialRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaPronosticoMaterialRepository
  extends PrismaRepositoryBase
  implements PronosticoMaterialRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: PronosticoMaterial): Promise<PronosticoMaterial> {
    const record = await this.prisma.pronosticoMaterial.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(
    idPronosticoMaterial: number,
  ): Promise<PronosticoMaterial | null> {
    const record = await this.prisma.pronosticoMaterial.findUnique({
      where: { idPronosticoMaterial },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: PronosticoMaterialRepositoryFindManyParams,
  ): Promise<PronosticoMaterial[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: ['idProyecto', 'idMaterial'],
        searchFields: ['periodoAnalisis', 'observaciones'],
      },
    );

    const records = await this.prisma.pronosticoMaterial.findMany({
      where: query.where as Prisma.PronosticoMaterialWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idPronosticoMaterial: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(
    idPronosticoMaterial: number,
    data: Partial<PronosticoMaterial>,
  ): Promise<PronosticoMaterial> {
    const record = await this.prisma.pronosticoMaterial.update({
      where: { idPronosticoMaterial },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idPronosticoMaterial: number): Promise<void> {
    await this.prisma.pronosticoMaterial.delete({
      where: { idPronosticoMaterial },
    });
  }

  private toDomain(record: PrismaPronosticoMaterialRecord): PronosticoMaterial {
    return new PronosticoMaterial({
      idPronosticoMaterial: record.idPronosticoMaterial,
      periodoAnalisis: record.periodoAnalisis,
      stockMinimo: record.stockMinimo,
      stockMaximo: record.stockMaximo,
      fechaGeneracion: record.fechaGeneracion,
      nivelConfianza: record.nivelConfianza,
      observaciones: record.observaciones ?? undefined,
      idProyecto: record.idProyecto ?? undefined,
      idMaterial: record.idMaterial ?? undefined,
    });
  }

  private toCreatePersistence(
    data: PronosticoMaterial,
  ): Prisma.PronosticoMaterialUncheckedCreateInput {
    return {
      periodoAnalisis: data.periodoAnalisis,
      stockMinimo: data.stockMinimo,
      stockMaximo: data.stockMaximo,
      fechaGeneracion: data.fechaGeneracion,
      nivelConfianza: data.nivelConfianza,
      observaciones: data.observaciones,
      idProyecto: data.idProyecto,
      idMaterial: data.idMaterial,
    };
  }

  private toUpdatePersistence(
    data: Partial<PronosticoMaterial>,
  ): Prisma.PronosticoMaterialUncheckedUpdateInput {
    const persistenceData: Prisma.PronosticoMaterialUncheckedUpdateInput = {
      periodoAnalisis: data.periodoAnalisis,
      stockMinimo: data.stockMinimo,
      stockMaximo: data.stockMaximo,
      fechaGeneracion: data.fechaGeneracion,
      nivelConfianza: data.nivelConfianza,
      observaciones: data.observaciones,
      idProyecto: data.idProyecto,
      idMaterial: data.idMaterial,
    };

    return this.omitUndefined(persistenceData);
  }
}
