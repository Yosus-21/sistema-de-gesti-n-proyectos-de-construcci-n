import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Reporte as PrismaReporteRecord,
  TipoReporte as PrismaTipoReporte,
} from '@prisma/client';
import { Reporte } from '../../../domain';
import { PrismaService } from '../../prisma';
import {
  ReporteRepository,
  ReporteRepositoryFindManyParams,
} from '../interfaces';
import { PrismaRepositoryBase } from './prisma-repository.base';

@Injectable()
export class PrismaReporteRepository
  extends PrismaRepositoryBase
  implements ReporteRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Reporte): Promise<Reporte> {
    const record = await this.prisma.reporte.create({
      data: this.toCreatePersistence(data),
    });

    return this.toDomain(record);
  }

  async findById(idReporte: number): Promise<Reporte | null> {
    const record = await this.prisma.reporte.findUnique({
      where: { idReporte },
    });

    return record ? this.toDomain(record) : null;
  }

  async findMany(params?: ReporteRepositoryFindManyParams): Promise<Reporte[]> {
    const query = this.buildListQuery(
      params as Record<string, unknown> | undefined,
      {
        filterKeys: ['idProyecto', 'tipoReporte'],
        searchFields: ['contenidoResumen', 'rutaArchivoPdf'],
      },
    );

    const records = await this.prisma.reporte.findMany({
      where: query.where as Prisma.ReporteWhereInput | undefined,
      skip: query.skip,
      take: query.take,
      orderBy: { idReporte: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async update(idReporte: number, data: Partial<Reporte>): Promise<Reporte> {
    const record = await this.prisma.reporte.update({
      where: { idReporte },
      data: this.toUpdatePersistence(data),
    });

    return this.toDomain(record);
  }

  async delete(idReporte: number): Promise<void> {
    await this.prisma.reporte.delete({
      where: { idReporte },
    });
  }

  private toDomain(record: PrismaReporteRecord): Reporte {
    return new Reporte({
      idReporte: record.idReporte,
      tipoReporte: record.tipoReporte as unknown as Reporte['tipoReporte'],
      fechaGeneracion: record.fechaGeneracion,
      fechaInicioPeriodo: record.fechaInicioPeriodo ?? undefined,
      fechaFinPeriodo: record.fechaFinPeriodo ?? undefined,
      porcentajeAvanceGeneral: record.porcentajeAvanceGeneral ?? undefined,
      contenidoResumen: record.contenidoResumen,
      rutaArchivoPdf: record.rutaArchivoPdf ?? undefined,
      idProyecto: record.idProyecto ?? undefined,
    });
  }

  private toCreatePersistence(
    data: Reporte,
  ): Prisma.ReporteUncheckedCreateInput {
    return {
      tipoReporte: data.tipoReporte as unknown as PrismaTipoReporte,
      fechaGeneracion: data.fechaGeneracion,
      fechaInicioPeriodo: data.fechaInicioPeriodo,
      fechaFinPeriodo: data.fechaFinPeriodo,
      porcentajeAvanceGeneral: data.porcentajeAvanceGeneral,
      contenidoResumen: data.contenidoResumen,
      rutaArchivoPdf: data.rutaArchivoPdf,
      idProyecto: data.idProyecto,
    };
  }

  private toUpdatePersistence(
    data: Partial<Reporte>,
  ): Prisma.ReporteUncheckedUpdateInput {
    const persistenceData: Prisma.ReporteUncheckedUpdateInput = {
      tipoReporte: data.tipoReporte as unknown as PrismaTipoReporte | undefined,
      fechaGeneracion: data.fechaGeneracion,
      fechaInicioPeriodo: data.fechaInicioPeriodo,
      fechaFinPeriodo: data.fechaFinPeriodo,
      porcentajeAvanceGeneral: data.porcentajeAvanceGeneral,
      contenidoResumen: data.contenidoResumen,
      rutaArchivoPdf: data.rutaArchivoPdf,
      idProyecto: data.idProyecto,
    };

    return this.omitUndefined(persistenceData);
  }
}
