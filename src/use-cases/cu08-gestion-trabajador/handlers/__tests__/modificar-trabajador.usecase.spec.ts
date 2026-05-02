import { ConflictException, NotFoundException } from '@nestjs/common';
import { OcupacionTrabajador, Trabajador } from '../../../../domain';
import type { TrabajadorRepository } from '../../../../infrastructure';
import { ModificarTrabajadorUseCase } from '../modificar-trabajador.usecase';

describe('ModificarTrabajadorUseCase', () => {
  let useCase: ModificarTrabajadorUseCase;
  let trabajadorRepositoryMock: jest.Mocked<TrabajadorRepository>;

  const trabajadorBase = new Trabajador({
    idTrabajador: 7,
    nombre: 'Maria Lopez',
    ci: 'CI-654321',
    telefono: '71234567',
    correo: 'maria@example.com',
    licenciaProfesional: 'LP-002',
    aniosExperiencia: 8,
    especializaciones: 'Acabados',
    certificaciones: 'Calidad',
    ocupacion: OcupacionTrabajador.CARPINTERO,
  });

  beforeEach(() => {
    trabajadorRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByCiOrCorreo: jest.fn(),
      existsByCiOrCorreoExcludingId: jest.fn(),
    };

    useCase = new ModificarTrabajadorUseCase(trabajadorRepositoryMock);
  });

  it('modifica trabajador existente', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorBase);
    trabajadorRepositoryMock.existsByCiOrCorreoExcludingId.mockResolvedValue(
      false,
    );
    trabajadorRepositoryMock.update.mockResolvedValue(
      new Trabajador({
        ...trabajadorBase,
        correo: 'maria.actualizada@example.com',
        ocupacion: OcupacionTrabajador.VIDRIERO,
      }),
    );

    const result = await useCase.execute({
      idTrabajador: 7,
      correo: 'maria.actualizada@example.com',
      ocupacion: OcupacionTrabajador.VIDRIERO,
    });

    expect(
      trabajadorRepositoryMock.existsByCiOrCorreoExcludingId,
    ).toHaveBeenCalledWith(
      trabajadorBase.ci,
      'maria.actualizada@example.com',
      7,
    );
    expect(trabajadorRepositoryMock.update).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        correo: 'maria.actualizada@example.com',
        ocupacion: OcupacionTrabajador.VIDRIERO,
      }),
    );
    expect(result.idTrabajador).toBe(7);
  });

  it('lanza NotFoundException si no existe', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idTrabajador: 404,
        nombre: 'No importa',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza ConflictException si CI/correo pertenece a otro trabajador', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorBase);
    trabajadorRepositoryMock.existsByCiOrCorreoExcludingId.mockResolvedValue(
      true,
    );

    await expect(
      useCase.execute({
        idTrabajador: 7,
        correo: 'duplicado@example.com',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(trabajadorRepositoryMock.update).not.toHaveBeenCalled();
  });
});
