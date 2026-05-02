import { NotFoundException } from '@nestjs/common';
import { OcupacionTrabajador, Trabajador } from '../../../../domain';
import type { TrabajadorRepository } from '../../../../infrastructure';
import { ConsultarTrabajadorUseCase } from '../consultar-trabajador.usecase';

describe('ConsultarTrabajadorUseCase', () => {
  let useCase: ConsultarTrabajadorUseCase;
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

    useCase = new ConsultarTrabajadorUseCase(trabajadorRepositoryMock);
  });

  it('retorna trabajador existente', async () => {
    const trabajador = new Trabajador({
      idTrabajador: 14,
      nombre: 'Ana Ruiz',
      ci: 'CI-14',
      telefono: '71111111',
      correo: 'ana@example.com',
      aniosExperiencia: 4,
      ocupacion: OcupacionTrabajador.PLOMERO,
    });

    trabajadorRepositoryMock.findById.mockResolvedValue(trabajador);

    await expect(
      useCase.execute({
        idTrabajador: 14,
      }),
    ).resolves.toBe(trabajador);
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
