import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  Tarea,
  TipoTarea,
} from '../../../../domain';
import type { TareaRepository } from '../../../../infrastructure';
import { ModificarTareaObraFinaUseCase } from '../modificar-tarea-obra-fina.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('ModificarTareaObraFinaUseCase', () => {
  let useCase: ModificarTareaObraFinaUseCase;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;

  beforeEach(() => {
    tareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ModificarTareaObraFinaUseCase(tareaRepositoryMock);
  });

  const tareaBase = new Tarea({
    idTarea: 41,
    nombre: 'Instalacion de puertas',
    descripcion: 'Trabajo base',
    tipoTarea: TipoTarea.OBRA_FINA,
    perfilRequerido: OcupacionTrabajador.CARPINTERO,
    duracionEstimada: 3,
    fechaInicioPlanificada: new Date('2026-05-10T00:00:00.000Z'),
    fechaFinPlanificada: new Date('2026-05-12T00:00:00.000Z'),
    estadoTarea: EstadoTarea.PENDIENTE,
    prioridad: PrioridadTarea.MEDIA,
    idCronograma: 18,
  });

  it('modifica tarea existente de obra fina', async () => {
    const dto = {
      idTarea: 41,
      nombre: 'Instalacion de puertas actualizada',
      perfilRequerido: OcupacionTrabajador.VIDRIERO,
      fechaFinPlanificada: '2026-05-13T00:00:00.000Z',
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
      41,
      expect.objectContaining({
        nombre: 'Instalacion de puertas actualizada',
        perfilRequerido: OcupacionTrabajador.VIDRIERO,
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

  it('lanza BadRequestException si la tarea no es Obra Fina', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(
      new Tarea({
        ...tareaBase,
        tipoTarea: TipoTarea.OBRA_BRUTA,
      }),
    );

    await expect(
      useCase.execute({
        idTarea: 41,
        nombre: 'No importa',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza BadRequestException si perfilRequerido es invalido', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);

    await expect(
      useCase.execute({
        idTarea: 41,
        perfilRequerido: OcupacionTrabajador.ELECTRICISTA,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza BadRequestException si las fechas quedan inconsistentes', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);

    await expect(
      useCase.execute({
        idTarea: 41,
        fechaInicioPlanificada: '2026-05-15T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
