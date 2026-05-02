import { Injectable } from '@nestjs/common';
import {
  OcupacionTrabajador as PrismaOcupacionTrabajador,
  Prisma,
  Trabajador as PrismaTrabajadorRecord,
} from '@prisma/client';
import { Trabajador } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  TrabajadorRepository,
  TrabajadorRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaTrabajadorRepository
  extends PrismaRepositoryBase
  implements TrabajadorRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Trabajador): Promise<Trabajador> {
    const record = await this.prisma.trabajador.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idTrabajador: number): Promise<Trabajador | null> {
    const record = await this.prisma.trabajador.findUnique({
      where: { idTrabajador },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(
    params?: TrabajadorRepositoryFindManyParams,
  ): Promise<Trabajador[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: ['ocupacion'],
        searchFields: [
          'nombre',
          'ci',
          'telefono',
          'correo',
          'especializaciones',
        ],
      },
    );

    const records = await this.prisma.trabajador.findMany({
      where: query.where as Prisma.TrabajadorWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idTrabajador: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async existsByCiOrCorreo(ci: string, correo: string): Promise<boolean> {
    const total = await this.prisma.trabajador.count({
      where: {
        OR: [{ ci }, { correo }],
      },
    });

    return total > 0;
  }

  async existsByCiOrCorreoExcludingId(
    ci: string,
    correo: string,
    idTrabajador: number,
  ): Promise<boolean> {
    const total = await this.prisma.trabajador.count({
      where: {
        idTrabajador: {
          not: idTrabajador,
        },
        OR: [{ ci }, { correo }],
      },
    });

    return total > 0;
  }

  async update(
    idTrabajador: number,
    data: Partial<Trabajador>,
  ): Promise<Trabajador> {
    const record = await this.prisma.trabajador.update({
      where: { idTrabajador },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idTrabajador: number): Promise<void> {
    await this.prisma.trabajador.delete({
      where: { idTrabajador },
    });
  }

  private toDomain(record: PrismaTrabajadorRecord): Trabajador {
    return new Trabajador({
      idTrabajador: record.idTrabajador,
      nombre: record.nombre,
      ci: record.ci,
      telefono: record.telefono,
      correo: record.correo,
      licenciaProfesional: record.licenciaProfesional ?? undefined,
      aniosExperiencia: record.aniosExperiencia,
      especializaciones: record.especializaciones ?? undefined,
      certificaciones: record.certificaciones ?? undefined,
      ocupacion: record.ocupacion as unknown as Trabajador['ocupacion'],
    });
  }

  private toCreatePersistence(
    data: Trabajador,
  ): Prisma.TrabajadorUncheckedCreateInput {
    return {
      nombre: data.nombre,
      ci: data.ci,
      telefono: data.telefono,
      correo: data.correo,
      licenciaProfesional: data.licenciaProfesional,
      aniosExperiencia: data.aniosExperiencia,
      especializaciones: data.especializaciones,
      certificaciones: data.certificaciones,
      ocupacion: data.ocupacion as unknown as PrismaOcupacionTrabajador,
    };
  }

  private toUpdatePersistence(
    data: Partial<Trabajador>,
  ): Prisma.TrabajadorUncheckedUpdateInput {
    const persistenceData: Prisma.TrabajadorUncheckedUpdateInput = {
      nombre: data.nombre,
      ci: data.ci,
      telefono: data.telefono,
      correo: data.correo,
      licenciaProfesional: data.licenciaProfesional,
      aniosExperiencia: data.aniosExperiencia,
      especializaciones: data.especializaciones,
      certificaciones: data.certificaciones,
      ocupacion: data.ocupacion as unknown as
        | PrismaOcupacionTrabajador
        | undefined,
    };

    return this.omitUndefined(persistenceData);
  }
}
