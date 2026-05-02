import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OcupacionTrabajador, Trabajador } from '../../../../domain';
import type { TrabajadorRepository } from '../../../../infrastructure';
import { VerificarDisponibilidadTrabajadorUseCase } from '../verificar-disponibilidad-trabajador.usecase';

describe('VerificarDisponibilidadTrabajadorUseCase', () => {
  let useCase: VerificarDisponibilidadTrabajadorUseCase;
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

    useCase = new VerificarDisponibilidadTrabajadorUseCase(
      trabajadorRepositoryMock,
    );
  });

  it('retorna disponibilidad provisional true si trabajador existe y fechas son validas', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(
      new Trabajador({
        idTrabajador: 3,
        nombre: 'Carlos Soto',
        ci: 'CI-3',
        telefono: '70000003',
        correo: 'carlos@example.com',
        aniosExperiencia: 5,
        ocupacion: OcupacionTrabajador.VIDRIERO,
      }),
    );

    await expect(
      useCase.execute({
        idTrabajador: 3,
        fechaInicio: '2026-05-10',
        fechaFin: '2026-05-12',
      }),
    ).resolves.toEqual({
      idTrabajador: 3,
      disponible: true,
      motivo:
        'Disponibilidad provisional: las asignaciones se validarán cuando se implemente CU09-CU11.',
    });
  });

  it('lanza NotFoundException si trabajador no existe', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idTrabajador: 404,
        fechaInicio: '2026-05-10',
        fechaFin: '2026-05-12',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza BadRequestException si fechaFin es anterior a fechaInicio', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(
      new Trabajador({
        idTrabajador: 3,
        nombre: 'Carlos Soto',
        ci: 'CI-3',
        telefono: '70000003',
        correo: 'carlos@example.com',
        aniosExperiencia: 5,
        ocupacion: OcupacionTrabajador.VIDRIERO,
      }),
    );

    await expect(
      useCase.execute({
        idTrabajador: 3,
        fechaInicio: '2026-05-12',
        fechaFin: '2026-05-10',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
