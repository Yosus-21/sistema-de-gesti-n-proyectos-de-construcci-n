import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from '../../../infrastructure';
import { EliminarMaterialDto } from '../dto';

@Injectable()
export class EliminarMaterialUseCase {
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(
    dto: EliminarMaterialDto,
  ): Promise<{ eliminado: true; idMaterial: number }> {
    const material = await this.materialRepository.findById(dto.idMaterial);

    if (!material) {
      throw new NotFoundException(
        `No se encontro el material con id ${dto.idMaterial}.`,
      );
    }

    await this.materialRepository.delete(dto.idMaterial);

    return {
      eliminado: true,
      idMaterial: dto.idMaterial,
    };
  }
}
