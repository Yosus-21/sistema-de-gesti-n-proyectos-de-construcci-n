import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntregaMaterial } from '../../../domain';
import {
  ENTREGA_MATERIAL_REPOSITORY,
  MATERIAL_REPOSITORY,
  type EntregaMaterialRepository,
  type MaterialRepository,
} from '../../../infrastructure';
import { ConfirmarRecepcionMaterialDto } from '../dto';

@Injectable()
export class ConfirmarRecepcionMaterialUseCase {
  constructor(
    @Inject(ENTREGA_MATERIAL_REPOSITORY)
    private readonly entregaMaterialRepository: EntregaMaterialRepository,
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(dto: ConfirmarRecepcionMaterialDto): Promise<EntregaMaterial> {
    const entrega = await this.entregaMaterialRepository.findById(
      dto.idEntregaMaterial,
    );

    if (!entrega) {
      throw new NotFoundException(
        `No se encontro la entrega de material con id ${dto.idEntregaMaterial}.`,
      );
    }

    if (!entrega.idMaterial) {
      throw new NotFoundException(
        'La entrega de material no tiene un material asociado.',
      );
    }

    const material = await this.materialRepository.findById(entrega.idMaterial);

    if (!material) {
      throw new NotFoundException(
        `No se encontro el material con id ${entrega.idMaterial}.`,
      );
    }

    if (entrega.estadoEntrega === 'RECIBIDA') {
      throw new ConflictException(
        'La entrega de material ya fue confirmada como recibida.',
      );
    }

    await this.materialRepository.update(entrega.idMaterial, {
      cantidadDisponible:
        material.cantidadDisponible + entrega.cantidadEntregada,
    });

    return this.entregaMaterialRepository.update(dto.idEntregaMaterial, {
      estadoEntrega: 'RECIBIDA',
    });
  }
}
