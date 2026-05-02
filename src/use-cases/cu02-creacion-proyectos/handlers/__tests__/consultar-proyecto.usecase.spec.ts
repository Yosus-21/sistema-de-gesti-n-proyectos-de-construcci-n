import { NotFoundException } from '@nestjs/common';
import { EstadoProyecto, Proyecto } from '../../../../domain';
import type { ProyectoRepository } from '../../../../infrastructure';
import { ConsultarProyectoDto } from '../../dto';
import { ConsultarProyectoUseCase } from '../consultar-proyecto.usecase';

describe('ConsultarProyectoUseCase', () => {
  let useCase: ConsultarProyectoUseCase;
  let proyectoRepositoryMock: jest.Mocked<ProyectoRepository>;

  const consultarProyectoDto: ConsultarProyectoDto = {
    idProyecto: 33,
  };

  beforeEach(() => {
    proyectoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsActiveByCliente: jest.fn(),
    };

    useCase = new ConsultarProyectoUseCase(proyectoRepositoryMock);
  });

  it('retorna proyecto existente', async () => {
    const proyecto = new Proyecto({
      idProyecto: 33,
      idCliente: 8,
      nombre: 'Proyecto Existente',
      descripcion: 'Descripcion',
      ubicacion: 'Cochabamba',
      presupuesto: 50000,
      fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
      fechaFinEstimada: new Date('2026-07-01T00:00:00.000Z'),
      estadoProyecto: EstadoProyecto.PLANIFICACION,
      especificacionesTecnicas: 'Specs',
    });

    proyectoRepositoryMock.findById.mockResolvedValue(proyecto);

    const result = await useCase.execute(consultarProyectoDto);

    expect(proyectoRepositoryMock.findById).toHaveBeenCalledWith(33);
    expect(result).toBe(proyecto);
  });

  it('lanza NotFoundException si no existe', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(consultarProyectoDto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
