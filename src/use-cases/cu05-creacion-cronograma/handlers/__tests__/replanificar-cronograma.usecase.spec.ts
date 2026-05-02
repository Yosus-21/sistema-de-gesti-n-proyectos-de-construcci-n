import { NotFoundException } from '@nestjs/common';
import { Cronograma, EstadoCronograma } from '../../../../domain';
import type { CronogramaRepository } from '../../../../infrastructure';
import { ReplanificarCronogramaDto } from '../../dto';
import { ReplanificarCronogramaUseCase } from '../replanificar-cronograma.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('ReplanificarCronogramaUseCase', () => {
  let useCase: ReplanificarCronogramaUseCase;
  let cronogramaRepositoryMock: jest.Mocked<CronogramaRepository>;

  beforeEach(() => {
    cronogramaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findByProyecto: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByProyecto: jest.fn(),
    };

    useCase = new ReplanificarCronogramaUseCase(cronogramaRepositoryMock);
  });

  it('replanifica cronograma existente', async () => {
    const dto: ReplanificarCronogramaDto = {
      idCronograma: 44,
      motivoReplanificacion: 'Cambio de alcance',
      nuevasAccionesAnteRetraso: 'Ajustar dependencias',
    };

    const cronogramaBase = new Cronograma({
      idCronograma: 44,
      idProyecto: 9,
      nombre: 'Cronograma Base',
      fechaCreacion: new Date('2026-05-01T00:00:00.000Z'),
      estadoCronograma: EstadoCronograma.PLANIFICADO,
    });

    const cronogramaActualizado = new Cronograma({
      ...cronogramaBase,
      motivoReplanificacion: 'Cambio de alcance',
      accionesAnteRetraso: 'Ajustar dependencias',
      fechaUltimaModificacion: new Date(),
      estadoCronograma: EstadoCronograma.REPLANIFICADO,
    });

    cronogramaRepositoryMock.findById.mockResolvedValue(cronogramaBase);
    cronogramaRepositoryMock.update.mockResolvedValue(cronogramaActualizado);

    const result = await useCase.execute(dto);

    expect(cronogramaRepositoryMock.findById).toHaveBeenCalledWith(44);
    expect(cronogramaRepositoryMock.update).toHaveBeenCalledWith(
      44,
      expect.objectContaining({
        motivoReplanificacion: 'Cambio de alcance',
        accionesAnteRetraso: 'Ajustar dependencias',
        fechaUltimaModificacion: expectAnyDate(),
        estadoCronograma: EstadoCronograma.REPLANIFICADO,
      }),
    );
    expect(result).toBe(cronogramaActualizado);
  });

  it('lanza NotFoundException si no existe', async () => {
    cronogramaRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idCronograma: 404,
        motivoReplanificacion: 'No importa',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
