import { EstadoOrdenCompra, OrdenCompra } from '../../../../domain';
import type { OrdenCompraRepository } from '../../../../infrastructure';
import { ListarOrdenesCompraDto } from '../../dto';
import { ListarOrdenesCompraUseCase } from '../listar-ordenes-compra.usecase';

describe('ListarOrdenesCompraUseCase', () => {
  let useCase: ListarOrdenesCompraUseCase;
  let ordenCompraRepositoryMock: jest.Mocked<OrdenCompraRepository>;

  const dtoBase: ListarOrdenesCompraDto = {
    idProveedor: 8,
    estadoOrden: EstadoOrdenCompra.BORRADOR,
    pagina: 1,
    limite: 10,
  };

  beforeEach(() => {
    ordenCompraRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addLinea: jest.fn(),
      findLineasByOrden: jest.fn(),
      calcularMontoTotal: jest.fn(),
    };

    useCase = new ListarOrdenesCompraUseCase(ordenCompraRepositoryMock);
  });

  it('retorna lista', async () => {
    const ordenes = [
      new OrdenCompra({
        idOrdenCompra: 1,
        idProveedor: 8,
        fechaOrden: new Date('2026-06-01T00:00:00.000Z'),
        estadoOrden: EstadoOrdenCompra.BORRADOR,
      }),
    ];

    ordenCompraRepositoryMock.findMany.mockResolvedValue(ordenes);

    const result = await useCase.execute(dtoBase);

    expect(result).toBe(ordenes);
  });

  it('pasa filtros idProveedor, estadoOrden, pagina y limite', async () => {
    ordenCompraRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dtoBase);

    expect(ordenCompraRepositoryMock.findMany).toHaveBeenCalledWith({
      idProveedor: dtoBase.idProveedor,
      estadoOrden: dtoBase.estadoOrden,
      pagina: dtoBase.pagina,
      limite: dtoBase.limite,
    });
  });
});
