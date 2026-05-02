import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Material } from '../../../domain';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from '../../../infrastructure';
import { ModificarMaterialDto } from '../dto';

@Injectable()
export class ModificarMaterialUseCase {
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(dto: ModificarMaterialDto): Promise<Material> {
    const materialActual = await this.materialRepository.findById(
      dto.idMaterial,
    );

    if (!materialActual) {
      throw new NotFoundException(
        `No se encontro el material con id ${dto.idMaterial}.`,
      );
    }

    if (dto.nombre !== undefined && dto.nombre !== materialActual.nombre) {
      const existeDuplicado =
        await this.materialRepository.existsByNombreExcludingId(
          dto.nombre,
          dto.idMaterial,
        );

      if (existeDuplicado) {
        throw new ConflictException(
          'Ya existe otro material registrado con el mismo nombre.',
        );
      }
    }

    if (dto.cantidadDisponible !== undefined && dto.cantidadDisponible < 0) {
      throw new BadRequestException(
        'La cantidad disponible no puede ser negativa.',
      );
    }

    if (dto.costoUnitario !== undefined && dto.costoUnitario < 0) {
      throw new BadRequestException('El costo unitario no puede ser negativo.');
    }

    const { idMaterial, ...cambios } = dto;

    return this.materialRepository.update(idMaterial, cambios);
  }
}
