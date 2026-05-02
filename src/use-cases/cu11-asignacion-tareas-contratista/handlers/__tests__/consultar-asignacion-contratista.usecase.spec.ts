import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AsignacionTarea, EstadoAsignacion } from '../../../../domain';
import type { AsignacionTareaRepository } from '../../../../infrastructure';
import { ConsultarAsignacionContratistaDto } from '../../dto';
import { ConsultarAsignacionContratistaUseCase } from '../consultar-asignacion-contratista.usecase';

describe('ConsultarAsignacionContratistaUseCase', () => {
  let useCase: ConsultarAsignacionContratistaUseCase;
  let asignacionTareaRepositoryMock: jest.Mocked<AsignacionTareaRepository>;

  const dtoBase: ConsultarAsignacionContratistaDto = {
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

    useCase = new ConsultarAsignacionContratistaUseCase(
      asignacionTareaRepositoryMock,
    );
  });

  it('retorna asignacion de contratista existente', async () => {
    const asignacion = new AsignacionTarea({
      idAsignacionTarea: 60,
      idTarea: 10,
      idTrabajador: 22,
      fechaAsignacion: new Date('2026-05-10T00:00:00.000Z'),
      rolEnLaTarea: 'Operario',
      estadoAsignacion: EstadoAsignacion.CONFIRMADA,
      asignadaPorContratista: true,
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

  it('lanza BadRequestException si no es asignacion de contratista', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(
      new AsignacionTarea({
        idAsignacionTarea: 60,
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
