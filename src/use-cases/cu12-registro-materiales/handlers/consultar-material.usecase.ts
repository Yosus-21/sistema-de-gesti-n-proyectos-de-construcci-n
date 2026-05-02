import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Material } from '../../../domain';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from '../../../infrastructure';
import { ConsultarMaterialDto } from '../dto';

@Injectable()
export class ConsultarMaterialUseCase {
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(dto: ConsultarMaterialDto): Promise<Material> {
    const material = await this.materialRepository.findById(dto.idMaterial);

    if (!material) {
      throw new NotFoundException(
        `No se encontro el material con id ${dto.idMaterial}.`,
      );
    }

    return material;
  }
}
