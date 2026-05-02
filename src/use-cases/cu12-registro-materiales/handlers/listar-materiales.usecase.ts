import { Inject, Injectable } from '@nestjs/common';
import { Material } from '../../../domain';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from '../../../infrastructure';
import { ListarMaterialesDto } from '../dto';

@Injectable()
export class ListarMaterialesUseCase {
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(dto: ListarMaterialesDto): Promise<Material[]> {
    return this.materialRepository.findMany({
      tipoMaterial: dto.tipoMaterial,
      busqueda: dto.busqueda,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
