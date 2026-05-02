import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Material } from '../../../domain';
import {
  MATERIAL_REPOSITORY,
  type MaterialRepository,
} from '../../../infrastructure';
import { RegistrarMaterialDto } from '../dto';

@Injectable()
export class RegistrarMaterialUseCase {
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(dto: RegistrarMaterialDto): Promise<Material> {
    const yaExiste = await this.materialRepository.existsByNombre(dto.nombre);

    if (yaExiste) {
      throw new ConflictException(
        'Ya existe un material registrado con el mismo nombre.',
      );
    }

    if (dto.cantidadDisponible < 0) {
      throw new BadRequestException(
        'La cantidad disponible no puede ser negativa.',
      );
    }

    if (dto.costoUnitario < 0) {
      throw new BadRequestException('El costo unitario no puede ser negativo.');
    }

    const material = new Material({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      tipoMaterial: dto.tipoMaterial,
      unidad: dto.unidad,
      cantidadDisponible: dto.cantidadDisponible,
      costoUnitario: dto.costoUnitario,
      especificacionesTecnicas: dto.especificacionesTecnicas,
    });

    return this.materialRepository.create(material);
  }
}
