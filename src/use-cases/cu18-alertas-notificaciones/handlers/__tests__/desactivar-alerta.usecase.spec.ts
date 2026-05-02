import { NotFoundException } from '@nestjs/common';
import { Alerta, EstadoAlerta, TipoAlerta } from '../../../../domain';
import type { AlertaRepository } from '../../../../infrastructure';
import { DesactivarAlertaDto } from '../../dto';
import { DesactivarAlertaUseCase } from '../desactivar-alerta.usecase';

describe('DesactivarAlertaUseCase', () => {
  let useCase: DesactivarAlertaUseCase;
  let alertaRepositoryMock: jest.Mocked<AlertaRepository>;

  const dtoBase: DesactivarAlertaDto = {
    idAlerta: 15,
  };

  beforeEach(() => {
    alertaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DesactivarAlertaUseCase(alertaRepositoryMock);
  });

  it('desactiva alerta existente', async () => {
    const alertaExistente = new Alerta({
      idAlerta: 15,
      criterioActivacion: 'Criterio',
      tipoAlerta: TipoAlerta.MATERIAL_BAJO,
      estadoAlerta: EstadoAlerta.ACTIVA,
    });
    const alertaInactiva = new Alerta({
      ...alertaExistente,
      estadoAlerta: EstadoAlerta.INACTIVA,
    });

    alertaRepositoryMock.findById.mockResolvedValue(alertaExistente);
    alertaRepositoryMock.update.mockResolvedValue(alertaInactiva);

    const result = await useCase.execute(dtoBase);

    expect(alertaRepositoryMock.update).toHaveBeenCalledWith(dtoBase.idAlerta, {
      estadoAlerta: EstadoAlerta.INACTIVA,
    });
    expect(result).toBe(alertaInactiva);
  });

  it('lanza NotFoundException si no existe', async () => {
    alertaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
