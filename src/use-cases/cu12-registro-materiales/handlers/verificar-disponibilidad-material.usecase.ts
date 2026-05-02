import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from '../../../infrastructure';
import { VerificarDisponibilidadMaterialDto } from '../dto';

@Injectable()
export class VerificarDisponibilidadMaterialUseCase {
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(dto: VerificarDisponibilidadMaterialDto): Promise<{
    idMaterial: number;
    cantidadDisponible: number;
    cantidadRequerida: number;
    disponible: boolean;
  }> {
    const material = await this.materialRepository.findById(dto.idMaterial);

    if (!material) {
      throw new NotFoundException(
        `No se encontro el material con id ${dto.idMaterial}.`,
      );
    }

    if (dto.cantidadRequerida < 0) {
      throw new BadRequestException(
        'La cantidad requerida no puede ser negativa.',
      );
    }

    return {
      idMaterial: dto.idMaterial,
      cantidadDisponible: material.cantidadDisponible,
      cantidadRequerida: dto.cantidadRequerida,
      disponible: material.cantidadDisponible >= dto.cantidadRequerida,
    };
  }
}
