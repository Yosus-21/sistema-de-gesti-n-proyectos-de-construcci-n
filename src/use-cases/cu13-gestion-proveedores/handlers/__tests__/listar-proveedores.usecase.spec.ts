import { Proveedor } from '../../../../domain';
import type { ProveedorRepository } from '../../../../infrastructure';
import { ListarProveedoresDto } from '../../dto';
import { ListarProveedoresUseCase } from '../listar-proveedores.usecase';

describe('ListarProveedoresUseCase', () => {
  let useCase: ListarProveedoresUseCase;
  let proveedorRepositoryMock: jest.Mocked<ProveedorRepository>;

  const dtoBase: ListarProveedoresDto = {
    busqueda: 'proveedor',
    pagina: 1,
    limite: 10,
  };

  beforeEach(() => {
    proveedorRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByNombreOrCorreo: jest.fn(),
      existsByNombreOrCorreoExcludingId: jest.fn(),
    };

    useCase = new ListarProveedoresUseCase(proveedorRepositoryMock);
  });

  it('retorna lista', async () => {
    const proveedores = [
      new Proveedor({
        idProveedor: 1,
        nombre: 'Proveedor Uno',
        direccion: 'Direccion Uno',
        telefono: '70000020',
        correo: 'uno@example.com',
      }),
    ];

    proveedorRepositoryMock.findMany.mockResolvedValue(proveedores);

    const result = await useCase.execute(dtoBase);

    expect(result).toBe(proveedores);
  });

  it('pasa filtros busqueda, pagina y limite al repositorio', async () => {
    proveedorRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dtoBase);

    expect(proveedorRepositoryMock.findMany).toHaveBeenCalledWith({
      busqueda: dtoBase.busqueda,
      pagina: dtoBase.pagina,
      limite: dtoBase.limite,
    });
  });
});
