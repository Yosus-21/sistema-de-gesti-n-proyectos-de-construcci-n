import { NotFoundException } from '@nestjs/common';
import { OcupacionTrabajador, Trabajador } from '../../../../domain';
import type { TrabajadorRepository } from '../../../../infrastructure';
import { EliminarTrabajadorUseCase } from '../eliminar-trabajador.usecase';

describe('EliminarTrabajadorUseCase', () => {
  let useCase: EliminarTrabajadorUseCase;
  let trabajadorRepositoryMock: jest.Mocked<TrabajadorRepository>;

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

    useCase = new EliminarTrabajadorUseCase(trabajadorRepositoryMock);
  });

  it('elimina trabajador existente', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(
      new Trabajador({
        idTrabajador: 5,
        nombre: 'Pedro Torres',
        ci: 'CI-555',
        telefono: '70000000',
        correo: 'pedro@example.com',
        aniosExperiencia: 3,
        ocupacion: OcupacionTrabajador.ALBANIL,
      }),
    );

    await expect(
      useCase.execute({
        idTrabajador: 5,
      }),
    ).resolves.toEqual({
      eliminado: true,
      idTrabajador: 5,
    });
    expect(trabajadorRepositoryMock.delete).toHaveBeenCalledWith(5);
  });

  it('lanza NotFoundException si no existe', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idTrabajador: 404,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
