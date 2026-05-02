import { NotFoundException } from '@nestjs/common';
import { Alerta, EstadoAlerta, TipoAlerta } from '../../../../domain';
import type { AlertaRepository } from '../../../../infrastructure';
import { ActivarAlertaDto } from '../../dto';
import { ActivarAlertaUseCase } from '../activar-alerta.usecase';

describe('ActivarAlertaUseCase', () => {
  let useCase: ActivarAlertaUseCase;
  let alertaRepositoryMock: jest.Mocked<AlertaRepository>;

  const dtoBase: ActivarAlertaDto = {
    idAlerta: 14,
  };

  beforeEach(() => {
    alertaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ActivarAlertaUseCase(alertaRepositoryMock);
  });

  it('activa alerta existente', async () => {
    const alertaExistente = new Alerta({
      idAlerta: 14,
      criterioActivacion: 'Criterio',
      tipoAlerta: TipoAlerta.PLAZO_CRITICO,
      estadoAlerta: EstadoAlerta.INACTIVA,
    });
    const alertaActiva = new Alerta({
      ...alertaExistente,
      estadoAlerta: EstadoAlerta.ACTIVA,
    });

    alertaRepositoryMock.findById.mockResolvedValue(alertaExistente);
    alertaRepositoryMock.update.mockResolvedValue(alertaActiva);

    const result = await useCase.execute(dtoBase);

    expect(alertaRepositoryMock.update).toHaveBeenCalledWith(dtoBase.idAlerta, {
      estadoAlerta: EstadoAlerta.ACTIVA,
    });
    expect(result).toBe(alertaActiva);
  });

  it('lanza NotFoundException si no existe', async () => {
    alertaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
