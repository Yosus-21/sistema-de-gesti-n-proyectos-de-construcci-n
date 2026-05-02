import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  Tarea,
  TipoTarea,
} from '../../../../domain';
import type { TareaRepository } from '../../../../infrastructure';
import { EliminarTareaObraFinaDto } from '../../dto';
import { EliminarTareaObraFinaUseCase } from '../eliminar-tarea-obra-fina.usecase';

describe('EliminarTareaObraFinaUseCase', () => {
  let useCase: EliminarTareaObraFinaUseCase;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;

  const eliminarDto: EliminarTareaObraFinaDto = {
    idTarea: 52,
  };

  beforeEach(() => {
    tareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new EliminarTareaObraFinaUseCase(tareaRepositoryMock);
  });

  it('elimina tarea de obra fina', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(
      new Tarea({
        idTarea: 52,
        nombre: 'Tarea eliminable',
        descripcion: 'Descripcion',
        tipoTarea: TipoTarea.OBRA_FINA,
        perfilRequerido: OcupacionTrabajador.VIDRIERO,
        duracionEstimada: 2,
        fechaInicioPlanificada: new Date('2026-05-11T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2026-05-13T00:00:00.000Z'),
        estadoTarea: EstadoTarea.PENDIENTE,
        prioridad: PrioridadTarea.BAJA,
        idCronograma: 21,
      }),
    );

    const result = await useCase.execute(eliminarDto);

    expect(tareaRepositoryMock.delete).toHaveBeenCalledWith(52);
    expect(result).toEqual({
      eliminado: true,
      idTarea: 52,
    });
  });

  it('lanza NotFoundException si no existe', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(eliminarDto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza BadRequestException si la tarea no es Obra Fina', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(
      new Tarea({
        idTarea: 52,
        nombre: 'Tarea incorrecta',
        descripcion: 'Descripcion',
        tipoTarea: TipoTarea.OBRA_BRUTA,
        perfilRequerido: OcupacionTrabajador.ALBANIL,
        duracionEstimada: 2,
        fechaInicioPlanificada: new Date('2026-05-11T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2026-05-13T00:00:00.000Z'),
        estadoTarea: EstadoTarea.PENDIENTE,
        prioridad: PrioridadTarea.BAJA,
        idCronograma: 21,
      }),
    );

    await expect(useCase.execute(eliminarDto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
