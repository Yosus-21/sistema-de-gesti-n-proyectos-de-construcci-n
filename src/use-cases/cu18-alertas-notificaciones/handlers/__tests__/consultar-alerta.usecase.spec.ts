import { NotFoundException } from '@nestjs/common';
import { Alerta, EstadoAlerta, TipoAlerta } from '../../../../domain';
import type { AlertaRepository } from '../../../../infrastructure';
import { ConsultarAlertaDto } from '../../dto';
import { ConsultarAlertaUseCase } from '../consultar-alerta.usecase';

describe('ConsultarAlertaUseCase', () => {
  let useCase: ConsultarAlertaUseCase;
  let alertaRepositoryMock: jest.Mocked<AlertaRepository>;

  const dtoBase: ConsultarAlertaDto = {
    idAlerta: 17,
  };

  beforeEach(() => {
    alertaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ConsultarAlertaUseCase(alertaRepositoryMock);
  });

  it('retorna alerta existente', async () => {
    const alertaExistente = new Alerta({
      idAlerta: 17,
      criterioActivacion: 'Desviación',
      tipoAlerta: TipoAlerta.DESVIACION_CRONOGRAMA,
      estadoAlerta: EstadoAlerta.ACTIVA,
    });

    alertaRepositoryMock.findById.mockResolvedValue(alertaExistente);

    const result = await useCase.execute(dtoBase);

    expect(result).toBe(alertaExistente);
  });

  it('lanza NotFoundException si no existe', async () => {
    alertaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
