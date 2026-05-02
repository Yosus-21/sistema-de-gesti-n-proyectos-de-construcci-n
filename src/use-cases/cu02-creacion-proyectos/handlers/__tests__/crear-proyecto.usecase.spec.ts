import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EstadoProyecto, Proyecto } from '../../../../domain';
import type {
  ClienteRepository,
  ProyectoRepository,
} from '../../../../infrastructure';
import { CrearProyectoDto } from '../../dto';
import { CrearProyectoUseCase } from '../crear-proyecto.usecase';

describe('CrearProyectoUseCase', () => {
  let useCase: CrearProyectoUseCase;
  let proyectoRepositoryMock: jest.Mocked<ProyectoRepository>;
  let clienteRepositoryMock: jest.Mocked<ClienteRepository>;

  const crearProyectoDto: CrearProyectoDto = {
    idCliente: 7,
    nombre: 'Proyecto E2E CU02',
    descripcion: 'Proyecto de prueba',
    ubicacion: 'La Paz',
    presupuesto: 150000,
    fechaInicio: '2026-05-01T00:00:00.000Z',
    fechaFinEstimada: '2026-06-01T00:00:00.000Z',
    especificacionesTecnicas: 'Especificaciones base',
  };

  beforeEach(() => {
    proyectoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsActiveByCliente: jest.fn(),
    };

    clienteRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByCorreoOrTelefono: jest.fn(),
      existsByCorreoOrTelefonoExcludingId: jest.fn(),
    };

    useCase = new CrearProyectoUseCase(
      proyectoRepositoryMock,
      clienteRepositoryMock,
    );
  });

  it('crea proyecto correctamente si cliente existe', async () => {
    clienteRepositoryMock.findById.mockResolvedValue({
      idCliente: 7,
      nombre: 'Cliente Base',
      direccion: 'Centro',
      telefono: '70000011',
      correo: 'cliente@e2e-cu02.local',
      tipoCliente: 'EMPRESA',
    });

    const proyectoCreado = new Proyecto({
      idProyecto: 21,
      idCliente: crearProyectoDto.idCliente,
      nombre: crearProyectoDto.nombre,
      descripcion: crearProyectoDto.descripcion,
      ubicacion: crearProyectoDto.ubicacion,
      presupuesto: crearProyectoDto.presupuesto,
      fechaInicio: new Date(crearProyectoDto.fechaInicio),
      fechaFinEstimada: new Date(crearProyectoDto.fechaFinEstimada),
      estadoProyecto: EstadoProyecto.PLANIFICACION,
      especificacionesTecnicas: crearProyectoDto.especificacionesTecnicas,
    });

    proyectoRepositoryMock.create.mockResolvedValue(proyectoCreado);

    const result = await useCase.execute(crearProyectoDto);

    expect(clienteRepositoryMock.findById).toHaveBeenCalledWith(7);
    expect(proyectoRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idCliente: 7,
        nombre: crearProyectoDto.nombre,
        estadoProyecto: EstadoProyecto.PLANIFICACION,
      }),
    );
    expect(result).toBe(proyectoCreado);
  });

  it('lanza NotFoundException si cliente no existe', async () => {
    clienteRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(crearProyectoDto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(proyectoRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si fechaFinEstimada es anterior a fechaInicio', async () => {
    clienteRepositoryMock.findById.mockResolvedValue({
      idCliente: 7,
      nombre: 'Cliente Base',
      direccion: 'Centro',
      telefono: '70000011',
      correo: 'cliente@e2e-cu02.local',
      tipoCliente: 'EMPRESA',
    });

    await expect(
      useCase.execute({
        ...crearProyectoDto,
        fechaInicio: '2026-06-10T00:00:00.000Z',
        fechaFinEstimada: '2026-06-01T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(proyectoRepositoryMock.create).not.toHaveBeenCalled();
  });
});
