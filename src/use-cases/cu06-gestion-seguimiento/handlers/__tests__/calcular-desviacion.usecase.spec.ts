import { NotFoundException } from '@nestjs/common';
import {
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  Tarea,
  TipoTarea,
} from '../../../../domain';
import type { TareaRepository } from '../../../../infrastructure';
import { CalcularDesviacionUseCase } from '../calcular-desviacion.usecase';

describe('CalcularDesviacionUseCase', () => {
  let useCase: CalcularDesviacionUseCase;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;

  beforeEach(() => {
    tareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CalcularDesviacionUseCase(tareaRepositoryMock);
  });

  it('calcula sin atraso cuando la fecha de referencia no supera fechaFinPlanificada', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(
      new Tarea({
        idTarea: 15,
        nombre: 'Tarea sin atraso',
        descripcion: 'Descripcion',
        tipoTarea: TipoTarea.OBRA_BRUTA,
        perfilRequerido: OcupacionTrabajador.ALBANIL,
        duracionEstimada: 5,
        fechaInicioPlanificada: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2099-12-31T00:00:00.000Z'),
        estadoTarea: EstadoTarea.EN_PROCESO,
        prioridad: PrioridadTarea.MEDIA,
        idCronograma: 2,
      }),
    );

    await expect(
      useCase.execute({
        idTarea: 15,
      }),
    ).resolves.toEqual({
      idTarea: 15,
      diasDesviacion: 0,
      atrasada: false,
    });
  });

  it('calcula atraso cuando fechaFinReal supera fechaFinPlanificada', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(
      new Tarea({
        idTarea: 16,
        nombre: 'Tarea con atraso',
        descripcion: 'Descripcion',
        tipoTarea: TipoTarea.OBRA_BRUTA,
        perfilRequerido: OcupacionTrabajador.PLOMERO,
        duracionEstimada: 4,
        fechaInicioPlanificada: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2026-05-10T00:00:00.000Z'),
        fechaFinReal: new Date('2026-05-13T00:00:00.000Z'),
        estadoTarea: EstadoTarea.COMPLETADA,
        prioridad: PrioridadTarea.ALTA,
        idCronograma: 2,
      }),
    );

    await expect(
      useCase.execute({
        idTarea: 16,
      }),
    ).resolves.toEqual({
      idTarea: 16,
      diasDesviacion: 3,
      atrasada: true,
    });
  });

  it('lanza NotFoundException si no existe la tarea', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idTarea: 404,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
