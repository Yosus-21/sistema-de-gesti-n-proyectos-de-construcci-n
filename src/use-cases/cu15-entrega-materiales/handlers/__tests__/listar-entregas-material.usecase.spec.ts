import { EntregaMaterial } from '../../../../domain';
import type { EntregaMaterialRepository } from '../../../../infrastructure';
import { ListarEntregasMaterialDto } from '../../dto';
import { ListarEntregasMaterialUseCase } from '../listar-entregas-material.usecase';

describe('ListarEntregasMaterialUseCase', () => {
  let useCase: ListarEntregasMaterialUseCase;
  let entregaMaterialRepositoryMock: jest.Mocked<EntregaMaterialRepository>;

  const dtoBase: ListarEntregasMaterialDto = {
    idOrdenCompra: 3,
    idMaterial: 8,
    pagina: 1,
    limite: 10,
  };

  beforeEach(() => {
    entregaMaterialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ListarEntregasMaterialUseCase(entregaMaterialRepositoryMock);
  });

  it('retorna lista', async () => {
    const entregas = [
      new EntregaMaterial({
        idEntregaMaterial: 1,
        idOrdenCompra: 3,
        idMaterial: 8,
        fechaEntrega: new Date('2026-06-15T00:00:00.000Z'),
        estadoEntrega: 'REGISTRADA',
        cantidadEntregada: 2,
      }),
    ];

    entregaMaterialRepositoryMock.findMany.mockResolvedValue(entregas);

    const result = await useCase.execute(dtoBase);

    expect(result).toBe(entregas);
  });

  it('pasa filtros idOrdenCompra, idMaterial, pagina y limite', async () => {
    entregaMaterialRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dtoBase);

    expect(entregaMaterialRepositoryMock.findMany).toHaveBeenCalledWith({
      idOrdenCompra: dtoBase.idOrdenCompra,
      idMaterial: dtoBase.idMaterial,
      pagina: dtoBase.pagina,
      limite: dtoBase.limite,
    });
  });
});
