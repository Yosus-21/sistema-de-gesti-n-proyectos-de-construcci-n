import { NotFoundException } from '@nestjs/common';
import { Cronograma, EstadoCronograma } from '../../../../domain';
import type { CronogramaRepository } from '../../../../infrastructure';
import { ConsultarCronogramaDto } from '../../dto';
import { ConsultarCronogramaUseCase } from '../consultar-cronograma.usecase';

describe('ConsultarCronogramaUseCase', () => {
  let useCase: ConsultarCronogramaUseCase;
  let cronogramaRepositoryMock: jest.Mocked<CronogramaRepository>;

  const consultarCronogramaDto: ConsultarCronogramaDto = {
    idCronograma: 51,
  };

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

    useCase = new ConsultarCronogramaUseCase(cronogramaRepositoryMock);
  });

  it('retorna cronograma existente', async () => {
    const cronograma = new Cronograma({
      idCronograma: 51,
      idProyecto: 12,
      nombre: 'Cronograma Consultado',
      fechaCreacion: new Date('2026-05-01T00:00:00.000Z'),
      estadoCronograma: EstadoCronograma.PLANIFICADO,
    });

    cronogramaRepositoryMock.findById.mockResolvedValue(cronograma);

    const result = await useCase.execute(consultarCronogramaDto);

    expect(cronogramaRepositoryMock.findById).toHaveBeenCalledWith(51);
    expect(result).toBe(cronograma);
  });

  it('lanza NotFoundException si no existe', async () => {
    cronogramaRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(consultarCronogramaDto),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
