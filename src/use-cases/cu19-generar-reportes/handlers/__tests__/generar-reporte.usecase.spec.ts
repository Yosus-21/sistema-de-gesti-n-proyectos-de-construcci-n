import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EstadoProyecto,
  Proyecto,
  Reporte,
  TipoReporte,
} from '../../../../domain';
import type {
  ProyectoRepository,
  ReporteRepository,
} from '../../../../infrastructure';
import { GenerarReporteDto } from '../../dto';
import { GenerarReporteUseCase } from '../generar-reporte.usecase';

describe('GenerarReporteUseCase', () => {
  let useCase: GenerarReporteUseCase;
  let reporteRepositoryMock: jest.Mocked<ReporteRepository>;
  let proyectoRepositoryMock: jest.Mocked<ProyectoRepository>;

  const proyectoExistente = new Proyecto({
    idProyecto: 7,
    nombre: 'Proyecto CU19',
    descripcion: 'Proyecto de prueba',
    ubicacion: 'Potosi',
    presupuesto: 190000,
    fechaInicio: new Date('2027-02-01T00:00:00.000Z'),
    fechaFinEstimada: new Date('2027-05-01T00:00:00.000Z'),
    estadoProyecto: EstadoProyecto.PLANIFICACION,
    especificacionesTecnicas: 'Specs CU19',
  });

  beforeEach(() => {
    reporteRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    proyectoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsActiveByCliente: jest.fn(),
    };

    useCase = new GenerarReporteUseCase(
      reporteRepositoryMock,
      proyectoRepositoryMock,
    );
  });

  it('genera reporte correctamente sin proyecto', async () => {
    const dto: GenerarReporteDto = {
      tipoReporte: TipoReporte.GENERAL,
      fechaInicioPeriodo: '2027-02-01T00:00:00.000Z',
      fechaFinPeriodo: '2027-02-28T00:00:00.000Z',
    };

    const reporteCreado = new Reporte({
      idReporte: 1,
      tipoReporte: TipoReporte.GENERAL,
      fechaGeneracion: new Date(),
      fechaInicioPeriodo: new Date(dto.fechaInicioPeriodo),
      fechaFinPeriodo: new Date(dto.fechaFinPeriodo),
      contenidoResumen: 'Reporte general provisional del sistema.',
    });

    reporteRepositoryMock.create.mockResolvedValue(reporteCreado);

    const result = await useCase.execute(dto);

    expect(reporteRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tipoReporte: TipoReporte.GENERAL,
        contenidoResumen: 'Reporte general provisional del sistema.',
        porcentajeAvanceGeneral: undefined,
      }),
    );
    expect(result).toBe(reporteCreado);
  });

  it('genera reporte correctamente con proyecto existente', async () => {
    const dto: GenerarReporteDto = {
      idProyecto: 7,
      tipoReporte: TipoReporte.AVANCE_PROYECTO,
    };

    const reporteCreado = new Reporte({
      idReporte: 2,
      idProyecto: 7,
      tipoReporte: TipoReporte.AVANCE_PROYECTO,
      fechaGeneracion: new Date(),
      porcentajeAvanceGeneral: 0,
      contenidoResumen: 'Reporte provisional de avance del proyecto.',
    });

    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);
    reporteRepositoryMock.create.mockResolvedValue(reporteCreado);

    const result = await useCase.execute(dto);

    expect(proyectoRepositoryMock.findById).toHaveBeenCalledWith(7);
    expect(reporteRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idProyecto: 7,
        tipoReporte: TipoReporte.AVANCE_PROYECTO,
        porcentajeAvanceGeneral: 0,
        contenidoResumen: 'Reporte provisional de avance del proyecto.',
      }),
    );
    expect(result).toBe(reporteCreado);
  });

  it('lanza NotFoundException si proyecto no existe', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idProyecto: 999,
        tipoReporte: TipoReporte.GENERAL,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza BadRequestException si fechaFinPeriodo es anterior a fechaInicioPeriodo', async () => {
    await expect(
      useCase.execute({
        tipoReporte: TipoReporte.COSTOS,
        fechaInicioPeriodo: '2027-03-10T00:00:00.000Z',
        fechaFinPeriodo: '2027-03-01T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
