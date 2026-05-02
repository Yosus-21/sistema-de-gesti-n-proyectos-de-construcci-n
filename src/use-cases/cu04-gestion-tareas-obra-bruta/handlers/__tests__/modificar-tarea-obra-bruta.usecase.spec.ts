import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  Tarea,
  TipoTarea,
} from '../../../../domain';
import type { TareaRepository } from '../../../../infrastructure';
import { ModificarTareaObraBrutaUseCase } from '../modificar-tarea-obra-bruta.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('ModificarTareaObraBrutaUseCase', () => {
  let useCase: ModificarTareaObraBrutaUseCase;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;

  beforeEach(() => {
    tareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ModificarTareaObraBrutaUseCase(tareaRepositoryMock);
  });

  const tareaBase = new Tarea({
    idTarea: 71,
    nombre: 'Levantado de muros',
    descripcion: 'Trabajo base',
    tipoTarea: TipoTarea.OBRA_BRUTA,
    perfilRequerido: OcupacionTrabajador.ALBANIL,
    duracionEstimada: 4,
    fechaInicioPlanificada: new Date('2026-05-10T00:00:00.000Z'),
    fechaFinPlanificada: new Date('2026-05-14T00:00:00.000Z'),
    estadoTarea: EstadoTarea.PENDIENTE,
    prioridad: PrioridadTarea.MEDIA,
    idCronograma: 31,
  });

  it('modifica tarea existente de obra bruta', async () => {
    const dto = {
      idTarea: 71,
      nombre: 'Levantado de muros actualizado',
      perfilRequerido: OcupacionTrabajador.PLOMERO,
      fechaFinPlanificada: '2026-05-15T00:00:00.000Z',
    };

    const tareaActualizada = new Tarea({
      ...tareaBase,
      nombre: dto.nombre,
      perfilRequerido: dto.perfilRequerido,
      fechaFinPlanificada: new Date(dto.fechaFinPlanificada),
    });

    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);
    tareaRepositoryMock.update.mockResolvedValue(tareaActualizada);

    const result = await useCase.execute(dto);

    expect(tareaRepositoryMock.update).toHaveBeenCalledWith(
      71,
      expect.objectContaining({
        nombre: 'Levantado de muros actualizado',
        perfilRequerido: OcupacionTrabajador.PLOMERO,
        fechaFinPlanificada: expectAnyDate(),
      }),
    );
    expect(result).toBe(tareaActualizada);
  });

  it('lanza NotFoundException si no existe', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idTarea: 404,
        nombre: 'No importa',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza BadRequestException si la tarea no es Obra Bruta', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(
      new Tarea({
        ...tareaBase,
        tipoTarea: TipoTarea.OBRA_FINA,
      }),
    );

    await expect(
      useCase.execute({
        idTarea: 71,
        nombre: 'No importa',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza BadRequestException si perfilRequerido es invalido', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);

    await expect(
      useCase.execute({
        idTarea: 71,
        perfilRequerido: OcupacionTrabajador.VIDRIERO,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza BadRequestException si las fechas quedan inconsistentes', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);

    await expect(
      useCase.execute({
        idTarea: 71,
        fechaInicioPlanificada: '2026-05-18T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
