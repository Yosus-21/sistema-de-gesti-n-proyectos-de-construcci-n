import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Contrato } from '../../../../domain';
import type { ContratoRepository } from '../../../../infrastructure';
import { ModificarContratoContratistaUseCase } from '../modificar-contrato-contratista.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('ModificarContratoContratistaUseCase', () => {
  let useCase: ModificarContratoContratistaUseCase;
  let contratoRepositoryMock: jest.Mocked<ContratoRepository>;

  const contratoBase = new Contrato({
    idContrato: 12,
    idProyecto: 5,
    idContratista: 8,
    fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
    fechaFin: new Date('2026-05-06T00:00:00.000Z'),
    metodoPago: 'Transferencia',
    terminosYCondiciones: 'Base',
    estadoContrato: 'VIGENTE',
    costoTotal: 1250,
  });

  beforeEach(() => {
    contratoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ModificarContratoContratistaUseCase(contratoRepositoryMock);
  });

  it('modifica contrato existente', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(contratoBase);
    contratoRepositoryMock.update.mockResolvedValue(
      new Contrato({
        ...contratoBase,
        metodoPago: 'Cheque',
        fechaFin: new Date('2026-05-08T00:00:00.000Z'),
      }),
    );

    const result = await useCase.execute({
      idContrato: 12,
      metodoPago: 'Cheque',
      fechaFin: '2026-05-08T00:00:00.000Z',
    });

    expect(contratoRepositoryMock.update).toHaveBeenCalledWith(
      12,
      expect.objectContaining({
        metodoPago: 'Cheque',
        fechaFin: expectAnyDate(),
      }),
    );
    expect(result.idContrato).toBe(12);
  });

  it('lanza NotFoundException si no existe', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idContrato: 404,
        metodoPago: 'No importa',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza BadRequestException si detalles tienen cantidadPersonas <= 0', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(contratoBase);

    await expect(
      useCase.execute({
        idContrato: 12,
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

  it('lanza BadRequestException si detalles tienen costoUnitario < 0', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(contratoBase);

    await expect(
      useCase.execute({
        idContrato: 12,
        detalles: [
          {
            idCargo: 1,
            cantidadPersonas: 2,
            costoUnitarioPorDia: -50,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('reemplaza detalles y recalcula costoTotal si llegan detalles válidos', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(contratoBase);

    // 5 días de contrato (del 1 al 6 son 5 días)
    // 3 personas * 100/día = 300/día
    // 5 días * 300 = 1500 total
    const nuevoCostoTotal = 1500;

    contratoRepositoryMock.update.mockResolvedValue(
      new Contrato({
        ...contratoBase,
        costoTotal: nuevoCostoTotal,
      }),
    );

    const result = await useCase.execute({
      idContrato: 12,
      detalles: [
        {
          idCargo: 1,
          cantidadPersonas: 3,
          costoUnitarioPorDia: 100,
        },
      ],
    });

    expect(contratoRepositoryMock.update).toHaveBeenCalledWith(
      12,
      expect.objectContaining({
        costoTotal: 1500,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        detalles: expect.arrayContaining([
          expect.objectContaining({
            cantidadPersonas: 3,
            costoUnitarioPorDia: 100,
            idCargo: 1,
          }),
        ]),
      }),
    );
    expect(result.idContrato).toBe(12);
  });

  it('lanza BadRequestException si fechas quedan inconsistentes', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(contratoBase);

    await expect(
      useCase.execute({
        idContrato: 12,
        fechaInicio: '2026-05-10T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
