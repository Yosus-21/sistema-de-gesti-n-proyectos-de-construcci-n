import { ConflictException } from '@nestjs/common';
import { OcupacionTrabajador, Trabajador } from '../../../../domain';
import type { TrabajadorRepository } from '../../../../infrastructure';
import { RegistrarTrabajadorDto } from '../../dto';
import { RegistrarTrabajadorUseCase } from '../registrar-trabajador.usecase';

describe('RegistrarTrabajadorUseCase', () => {
  let useCase: RegistrarTrabajadorUseCase;
  let trabajadorRepositoryMock: jest.Mocked<TrabajadorRepository>;

  const dtoBase: RegistrarTrabajadorDto = {
    nombre: 'Juan Perez',
    ci: 'CI-123456',
    telefono: '76543210',
    correo: 'juan@example.com',
    licenciaProfesional: 'LP-001',
    aniosExperiencia: 6,
    especializaciones: 'Instalaciones electricas',
    certificaciones: 'Seguridad industrial',
    ocupacion: OcupacionTrabajador.ELECTRICISTA,
  };

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

    useCase = new RegistrarTrabajadorUseCase(trabajadorRepositoryMock);
  });

  it('registra trabajador correctamente', async () => {
    const trabajadorCreado = new Trabajador({
      idTrabajador: 12,
      ...dtoBase,
    });

    trabajadorRepositoryMock.existsByCiOrCorreo.mockResolvedValue(false);
    trabajadorRepositoryMock.create.mockResolvedValue(trabajadorCreado);

    const result = await useCase.execute(dtoBase);

    expect(trabajadorRepositoryMock.existsByCiOrCorreo).toHaveBeenCalledWith(
      dtoBase.ci,
      dtoBase.correo,
    );
    expect(trabajadorRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: dtoBase.nombre,
        ci: dtoBase.ci,
        correo: dtoBase.correo,
        ocupacion: dtoBase.ocupacion,
      }),
    );
    expect(result).toBe(trabajadorCreado);
  });

  it('lanza ConflictException si CI o correo ya existe', async () => {
    trabajadorRepositoryMock.existsByCiOrCorreo.mockResolvedValue(true);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(trabajadorRepositoryMock.create).not.toHaveBeenCalled();
  });
});
