import { Material, TipoMaterial } from '../../../../domain';
import type { MaterialRepository } from '../../../../infrastructure';
import { ListarMaterialesDto } from '../../dto';
import { ListarMaterialesUseCase } from '../listar-materiales.usecase';

describe('ListarMaterialesUseCase', () => {
  let useCase: ListarMaterialesUseCase;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const dtoBase: ListarMaterialesDto = {
    tipoMaterial: TipoMaterial.OBRA_BRUTA,
    busqueda: 'cemento',
    pagina: 2,
    limite: 5,
  };

  beforeEach(() => {
    materialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByNombre: jest.fn(),
      existsByNombreExcludingId: jest.fn(),
    };

    useCase = new ListarMaterialesUseCase(materialRepositoryMock);
  });

  it('retorna lista', async () => {
    const materiales = [
      new Material({
        idMaterial: 1,
        nombre: 'Cemento',
        descripcion: 'Material base',
        tipoMaterial: TipoMaterial.OBRA_BRUTA,
        unidad: 'bolsa',
        cantidadDisponible: 10,
        costoUnitario: 40,
      }),
    ];

    materialRepositoryMock.findMany.mockResolvedValue(materiales);

    const result = await useCase.execute(dtoBase);

    expect(result).toBe(materiales);
  });

  it('pasa filtros tipoMaterial, busqueda, pagina y limite al repositorio', async () => {
    materialRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dtoBase);

    expect(materialRepositoryMock.findMany).toHaveBeenCalledWith({
      tipoMaterial: dtoBase.tipoMaterial,
      busqueda: dtoBase.busqueda,
      pagina: dtoBase.pagina,
      limite: dtoBase.limite,
    });
  });
});
