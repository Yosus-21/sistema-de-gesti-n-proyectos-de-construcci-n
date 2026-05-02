import { NotFoundException } from '@nestjs/common';
import { AsignacionTarea, EstadoAsignacion } from '../../../../domain';
import type { AsignacionTareaRepository } from '../../../../infrastructure';
import { ConsultarAsignacionObraBrutaDto } from '../../dto';
import { ConsultarAsignacionObraBrutaUseCase } from '../consultar-asignacion-obra-bruta.usecase';

describe('ConsultarAsignacionObraBrutaUseCase', () => {
  let useCase: ConsultarAsignacionObraBrutaUseCase;
  let asignacionTareaRepositoryMock: jest.Mocked<AsignacionTareaRepository>;

  const dtoBase: ConsultarAsignacionObraBrutaDto = {
    idAsignacionTarea: 60,
  };

  beforeEach(() => {
    asignacionTareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsActiveAssignment: jest.fn(),
    };

    useCase = new ConsultarAsignacionObraBrutaUseCase(
      asignacionTareaRepositoryMock,
    );
  });

  it('retorna asignacion existente', async () => {
    const asignacion = new AsignacionTarea({
      idAsignacionTarea: 60,
      idTarea: 10,
      idTrabajador: 22,
      fechaAsignacion: new Date('2026-05-10T00:00:00.000Z'),
      rolEnLaTarea: 'Operario',
      estadoAsignacion: EstadoAsignacion.CONFIRMADA,
      asignadaPorContratista: false,
    });

    asignacionTareaRepositoryMock.findById.mockResolvedValue(asignacion);

    const result = await useCase.execute(dtoBase);

    expect(result).toBe(asignacion);
  });

  it('lanza NotFoundException si no existe', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
