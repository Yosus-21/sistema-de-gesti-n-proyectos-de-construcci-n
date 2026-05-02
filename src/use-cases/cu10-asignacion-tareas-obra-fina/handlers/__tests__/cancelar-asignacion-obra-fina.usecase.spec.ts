import { NotFoundException } from '@nestjs/common';
import { AsignacionTarea, EstadoAsignacion } from '../../../../domain';
import type { AsignacionTareaRepository } from '../../../../infrastructure';
import { CancelarAsignacionObraFinaDto } from '../../dto';
import { CancelarAsignacionObraFinaUseCase } from '../cancelar-asignacion-obra-fina.usecase';

describe('CancelarAsignacionObraFinaUseCase', () => {
  let useCase: CancelarAsignacionObraFinaUseCase;
  let asignacionTareaRepositoryMock: jest.Mocked<AsignacionTareaRepository>;

  const dtoBase: CancelarAsignacionObraFinaDto = {
    idAsignacionTarea: 50,
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

    useCase = new CancelarAsignacionObraFinaUseCase(
      asignacionTareaRepositoryMock,
    );
  });

  it('cancela asignacion existente cambiando estado a CANCELADA', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(
      new AsignacionTarea({
        idAsignacionTarea: 50,
        idTarea: 10,
        idTrabajador: 22,
        fechaAsignacion: new Date('2026-05-10T00:00:00.000Z'),
        rolEnLaTarea: 'Operario',
        estadoAsignacion: EstadoAsignacion.CONFIRMADA,
        asignadaPorContratista: false,
      }),
    );
    asignacionTareaRepositoryMock.update.mockResolvedValue(
      new AsignacionTarea({
        idAsignacionTarea: 50,
        idTarea: 10,
        idTrabajador: 22,
        fechaAsignacion: new Date('2026-05-10T00:00:00.000Z'),
        rolEnLaTarea: 'Operario',
        estadoAsignacion: EstadoAsignacion.CANCELADA,
        asignadaPorContratista: false,
      }),
    );

    const result = await useCase.execute(dtoBase);

    expect(asignacionTareaRepositoryMock.update).toHaveBeenCalledWith(50, {
      estadoAsignacion: EstadoAsignacion.CANCELADA,
    });
    expect(result.estadoAsignacion).toBe(EstadoAsignacion.CANCELADA);
  });

  it('lanza NotFoundException si no existe', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(asignacionTareaRepositoryMock.update).not.toHaveBeenCalled();
  });
});
