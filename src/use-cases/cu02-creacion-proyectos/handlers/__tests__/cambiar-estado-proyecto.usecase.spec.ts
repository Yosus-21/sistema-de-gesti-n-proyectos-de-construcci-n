import { NotFoundException } from '@nestjs/common';
import { EstadoProyecto, Proyecto } from '../../../../domain';
import type { ProyectoRepository } from '../../../../infrastructure';
import { CambiarEstadoProyectoDto } from '../../dto';
import { CambiarEstadoProyectoUseCase } from '../cambiar-estado-proyecto.usecase';

describe('CambiarEstadoProyectoUseCase', () => {
  let useCase: CambiarEstadoProyectoUseCase;
  let proyectoRepositoryMock: jest.Mocked<ProyectoRepository>;

  beforeEach(() => {
    proyectoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsActiveByCliente: jest.fn(),
    };

    useCase = new CambiarEstadoProyectoUseCase(proyectoRepositoryMock);
  });

  it('cambia estado de proyecto existente', async () => {
    const dto: CambiarEstadoProyectoDto = {
      idProyecto: 41,
      estadoProyecto: EstadoProyecto.EN_EJECUCION,
    };

    const proyectoExistente = new Proyecto({
      idProyecto: 41,
      idCliente: 10,
      nombre: 'Proyecto Base',
      descripcion: 'Descripcion',
      ubicacion: 'Tarija',
      presupuesto: 78000,
      fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
      fechaFinEstimada: new Date('2026-08-01T00:00:00.000Z'),
      estadoProyecto: EstadoProyecto.PLANIFICACION,
      especificacionesTecnicas: 'Specs',
    });

    const proyectoActualizado = new Proyecto({
      ...proyectoExistente,
      estadoProyecto: EstadoProyecto.EN_EJECUCION,
    });

    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);
    proyectoRepositoryMock.update.mockResolvedValue(proyectoActualizado);

    const result = await useCase.execute(dto);

    expect(proyectoRepositoryMock.findById).toHaveBeenCalledWith(41);
    expect(proyectoRepositoryMock.update).toHaveBeenCalledWith(41, {
      estadoProyecto: EstadoProyecto.EN_EJECUCION,
    });
    expect(result).toBe(proyectoActualizado);
  });

  it('lanza NotFoundException si no existe', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idProyecto: 404,
        estadoProyecto: EstadoProyecto.PAUSADO,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
