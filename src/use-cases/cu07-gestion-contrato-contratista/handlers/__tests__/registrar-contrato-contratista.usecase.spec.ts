import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  Contratista,
  Contrato,
  EstadoProyecto,
  Proyecto,
} from '../../../../domain';
import type {
  ContratistaRepository,
  ContratoRepository,
  ProyectoRepository,
} from '../../../../infrastructure';
import { RegistrarContratoContratistaDto } from '../../dto';
import { RegistrarContratoContratistaUseCase } from '../registrar-contrato-contratista.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('RegistrarContratoContratistaUseCase', () => {
  let useCase: RegistrarContratoContratistaUseCase;
  let contratoRepositoryMock: jest.Mocked<ContratoRepository>;
  let contratistaRepositoryMock: jest.Mocked<ContratistaRepository>;
  let proyectoRepositoryMock: jest.Mocked<ProyectoRepository>;

  const dtoBase: RegistrarContratoContratistaDto = {
    idProyecto: 10,
    idContratista: 22,
    fechaInicio: '2026-05-01T00:00:00.000Z',
    fechaFin: '2026-05-06T00:00:00.000Z',
    metodoPago: 'Transferencia',
    terminosYCondiciones: 'Pago semanal',
    detalles: [
      {
        idCargo: 1,
        cantidadPersonas: 2,
        costoUnitarioPorDia: 100,
      },
      {
        idCargo: 2,
        cantidadPersonas: 1,
        costoUnitarioPorDia: 50,
      },
    ],
  };

  beforeEach(() => {
    contratoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    contratistaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByCiOrCorreo: jest.fn(),
      existsByCiOrCorreoExcludingId: jest.fn(),
    };

    proyectoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsActiveByCliente: jest.fn(),
    };

    useCase = new RegistrarContratoContratistaUseCase(
      contratoRepositoryMock,
      contratistaRepositoryMock,
      proyectoRepositoryMock,
    );
  });

  it('registra contrato correctamente si proyecto y contratista existen', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(
      new Proyecto({
        idProyecto: 10,
        idCliente: 2,
        nombre: 'Proyecto Base',
        descripcion: 'Descripcion',
        ubicacion: 'La Paz',
        presupuesto: 100000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-09-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs',
      }),
    );
    contratistaRepositoryMock.findById.mockResolvedValue(
      new Contratista({
        idContratista: 22,
        nombre: 'Contratista Base',
        ci: 'CI-22',
        empresa: 'Constructora',
        telefono: '70000022',
        correo: 'contratista@example.com',
      }),
    );

    const contratoCreado = new Contrato({
      idContrato: 40,
      idProyecto: 10,
      idContratista: 22,
      fechaInicio: new Date(dtoBase.fechaInicio),
      fechaFin: new Date(dtoBase.fechaFin),
      metodoPago: dtoBase.metodoPago,
      terminosYCondiciones: dtoBase.terminosYCondiciones,
      estadoContrato: 'VIGENTE',
      costoTotal: 1250,
    });

    contratoRepositoryMock.create.mockResolvedValue(contratoCreado);

    const result = await useCase.execute(dtoBase);

    expect(contratoRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idProyecto: 10,
        idContratista: 22,
        metodoPago: 'Transferencia',
        terminosYCondiciones: 'Pago semanal',
        estadoContrato: 'VIGENTE',
        costoTotal: 1250,
        fechaInicio: expectAnyDate(),
        fechaFin: expectAnyDate(),
      }),
    );
    expect(result).toBe(contratoCreado);
  });

  it('lanza NotFoundException si proyecto no existe', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(contratoRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('lanza NotFoundException si contratista no existe', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(
      new Proyecto({
        idProyecto: 10,
        idCliente: 2,
        nombre: 'Proyecto Base',
        descripcion: 'Descripcion',
        ubicacion: 'La Paz',
        presupuesto: 100000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-09-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs',
      }),
    );
    contratistaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(contratoRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si fechaFin es anterior a fechaInicio', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(
      new Proyecto({
        idProyecto: 10,
        idCliente: 2,
        nombre: 'Proyecto Base',
        descripcion: 'Descripcion',
        ubicacion: 'La Paz',
        presupuesto: 100000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-09-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs',
      }),
    );
    contratistaRepositoryMock.findById.mockResolvedValue(
      new Contratista({
        idContratista: 22,
        nombre: 'Contratista Base',
        ci: 'CI-22',
        empresa: 'Constructora',
        telefono: '70000022',
        correo: 'contratista@example.com',
      }),
    );

    await expect(
      useCase.execute({
        ...dtoBase,
        fechaFin: '2026-04-30T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza BadRequestException si cantidadPersonas es <= 0', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(
      new Proyecto({
        idProyecto: 10,
        estadoProyecto: EstadoProyecto.PLANIFICACION,
      }),
    );
    contratistaRepositoryMock.findById.mockResolvedValue(
      new Contratista({ idContratista: 22 }),
    );

    await expect(
      useCase.execute({
        ...dtoBase,
        detalles: [
          {
            idCargo: 1,
            cantidadPersonas: 0,
            costoUnitarioPorDia: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza BadRequestException si costoUnitarioPorDia es < 0', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(
      new Proyecto({
        idProyecto: 10,
        estadoProyecto: EstadoProyecto.PLANIFICACION,
      }),
    );
    contratistaRepositoryMock.findById.mockResolvedValue(
      new Contratista({ idContratista: 22 }),
    );

    await expect(
      useCase.execute({
        ...dtoBase,
        detalles: [
          {
            idCargo: 1,
            cantidadPersonas: 2,
            costoUnitarioPorDia: -10,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
