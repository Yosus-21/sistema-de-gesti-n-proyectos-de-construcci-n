import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AsignacionTarea, EstadoAsignacion } from '../../../../domain';
import type { AsignacionTareaRepository } from '../../../../infrastructure';
import { CancelarAsignacionContratistaDto } from '../../dto';
import { CancelarAsignacionContratistaUseCase } from '../cancelar-asignacion-contratista.usecase';

describe('CancelarAsignacionContratistaUseCase', () => {
  let useCase: CancelarAsignacionContratistaUseCase;
  let asignacionTareaRepositoryMock: jest.Mocked<AsignacionTareaRepository>;

  const dtoBase: CancelarAsignacionContratistaDto = {
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

    useCase = new CancelarAsignacionContratistaUseCase(
      asignacionTareaRepositoryMock,
    );
  });

  it('cancela asignacion de contratista cambiando estado a CANCELADA', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(
      new AsignacionTarea({
        idAsignacionTarea: 50,
        idTarea: 10,
        idTrabajador: 22,
        fechaAsignacion: new Date('2026-05-10T00:00:00.000Z'),
        rolEnLaTarea: 'Operario',
        estadoAsignacion: EstadoAsignacion.CONFIRMADA,
        asignadaPorContratista: true,
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
        asignadaPorContratista: true,
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
  });

  it('lanza BadRequestException si no es asignacion de contratista', async () => {
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

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
