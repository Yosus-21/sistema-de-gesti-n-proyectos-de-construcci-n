import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  Alerta,
  EstadoAlerta,
  MetodoNotificacion,
  TipoAlerta,
} from '../../../../domain';
import type { AlertaRepository } from '../../../../infrastructure';
import { GenerarNotificacionDto } from '../../dto';
import { GenerarNotificacionUseCase } from '../generar-notificacion.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('GenerarNotificacionUseCase', () => {
  let useCase: GenerarNotificacionUseCase;
  let alertaRepositoryMock: jest.Mocked<AlertaRepository>;

  const dtoBase: GenerarNotificacionDto = {
    idAlerta: 16,
    mensajeNotificacion: 'Aviso interno',
    metodoNotificacion: MetodoNotificacion.SISTEMA,
  };

  beforeEach(() => {
    alertaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GenerarNotificacionUseCase(alertaRepositoryMock);
  });

  it('genera notificación provisional correctamente', async () => {
    const alertaExistente = new Alerta({
      idAlerta: 16,
      criterioActivacion: 'Stock bajo',
      tipoAlerta: TipoAlerta.MATERIAL_BAJO,
      estadoAlerta: EstadoAlerta.ACTIVA,
    });

    alertaRepositoryMock.findById.mockResolvedValue(alertaExistente);
    alertaRepositoryMock.update.mockResolvedValue(
      new Alerta({
        ...alertaExistente,
        estadoAlerta: EstadoAlerta.NOTIFICADA,
        mensajeNotificacion: dtoBase.mensajeNotificacion,
        metodoNotificacion: dtoBase.metodoNotificacion,
        fechaGeneracion: new Date(),
      }),
    );

    const result = await useCase.execute(dtoBase);

    expect(alertaRepositoryMock.update).toHaveBeenCalledWith(dtoBase.idAlerta, {
      mensajeNotificacion: dtoBase.mensajeNotificacion,
      metodoNotificacion: dtoBase.metodoNotificacion,
      fechaGeneracion: expectAnyDate(),
      estadoAlerta: EstadoAlerta.NOTIFICADA,
    });
    expect(result).toEqual({
      idAlerta: dtoBase.idAlerta,
      notificada: true,
      metodoNotificacion: MetodoNotificacion.SISTEMA,
      mensajeNotificacion: 'Aviso interno',
      fechaGeneracion: expectAnyDate(),
    });
  });

  it('lanza NotFoundException si alerta no existe', async () => {
    alertaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza BadRequestException si alerta está INACTIVA', async () => {
    alertaRepositoryMock.findById.mockResolvedValue(
      new Alerta({
        idAlerta: 16,
        criterioActivacion: 'Inactiva',
        tipoAlerta: TipoAlerta.PLAZO_CRITICO,
        estadoAlerta: EstadoAlerta.INACTIVA,
      }),
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
