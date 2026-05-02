import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Material } from '../../../domain';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from '../../../infrastructure';
import { ActualizarStockMaterialDto } from '../dto';

@Injectable()
export class ActualizarStockMaterialUseCase {
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(dto: ActualizarStockMaterialDto): Promise<Material> {
    const material = await this.materialRepository.findById(dto.idMaterial);

    if (!material) {
      throw new NotFoundException(
        `No se encontro el material con id ${dto.idMaterial}.`,
      );
    }

    const nuevoStock = material.cantidadDisponible + dto.cantidad;

    if (nuevoStock < 0) {
      throw new BadRequestException(
        'El stock no puede quedar en un valor negativo.',
      );
    }

    return this.materialRepository.update(dto.idMaterial, {
      cantidadDisponible: nuevoStock,
    });
  }
}
