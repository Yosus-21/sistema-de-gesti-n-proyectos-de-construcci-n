import { NotFoundException } from '@nestjs/common';
import { Reporte, TipoReporte } from '../../../../domain';
import type { ReporteRepository } from '../../../../infrastructure';
import { ConsultarReporteDto } from '../../dto';
import { ConsultarReporteUseCase } from '../consultar-reporte.usecase';

describe('ConsultarReporteUseCase', () => {
  let useCase: ConsultarReporteUseCase;
  let reporteRepositoryMock: jest.Mocked<ReporteRepository>;

  const dtoBase: ConsultarReporteDto = {
    idReporte: 11,
  };

  beforeEach(() => {
    reporteRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ConsultarReporteUseCase(reporteRepositoryMock);
  });

  it('retorna reporte existente', async () => {
    const reporteExistente = new Reporte({
      idReporte: 11,
      tipoReporte: TipoReporte.GENERAL,
      fechaGeneracion: new Date('2027-02-10T00:00:00.000Z'),
      contenidoResumen: 'Reporte general provisional del sistema.',
    });

    reporteRepositoryMock.findById.mockResolvedValue(reporteExistente);

    const result = await useCase.execute(dtoBase);

    expect(result).toBe(reporteExistente);
  });

  it('lanza NotFoundException si no existe', async () => {
    reporteRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
