import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  Tarea,
  TipoTarea,
} from '../../../../domain';
import type { TareaRepository } from '../../../../infrastructure';
import { EliminarTareaObraBrutaDto } from '../../dto';
import { EliminarTareaObraBrutaUseCase } from '../eliminar-tarea-obra-bruta.usecase';

describe('EliminarTareaObraBrutaUseCase', () => {
  let useCase: EliminarTareaObraBrutaUseCase;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;

  const eliminarDto: EliminarTareaObraBrutaDto = {
    idTarea: 82,
  };

  beforeEach(() => {
    tareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new EliminarTareaObraBrutaUseCase(tareaRepositoryMock);
  });

  it('elimina tarea de obra bruta', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(
      new Tarea({
        idTarea: 82,
        nombre: 'Tarea eliminable',
        descripcion: 'Descripcion',
        tipoTarea: TipoTarea.OBRA_BRUTA,
        perfilRequerido: OcupacionTrabajador.PLOMERO,
        duracionEstimada: 2,
        fechaInicioPlanificada: new Date('2026-05-11T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2026-05-13T00:00:00.000Z'),
        estadoTarea: EstadoTarea.PENDIENTE,
        prioridad: PrioridadTarea.BAJA,
        idCronograma: 41,
      }),
    );

    const result = await useCase.execute(eliminarDto);

    expect(tareaRepositoryMock.delete).toHaveBeenCalledWith(82);
    expect(result).toEqual({
      eliminado: true,
      idTarea: 82,
    });
  });

  it('lanza NotFoundException si no existe', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(eliminarDto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza BadRequestException si la tarea no es Obra Bruta', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(
      new Tarea({
        idTarea: 82,
        nombre: 'Tarea incorrecta',
        descripcion: 'Descripcion',
        tipoTarea: TipoTarea.OBRA_FINA,
        perfilRequerido: OcupacionTrabajador.VIDRIERO,
        duracionEstimada: 2,
        fechaInicioPlanificada: new Date('2026-05-11T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2026-05-13T00:00:00.000Z'),
        estadoTarea: EstadoTarea.PENDIENTE,
        prioridad: PrioridadTarea.BAJA,
        idCronograma: 41,
      }),
    );

    await expect(useCase.execute(eliminarDto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
