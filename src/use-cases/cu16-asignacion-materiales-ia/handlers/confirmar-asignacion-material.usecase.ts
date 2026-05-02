import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AsignacionMaterial, EstadoAsignacion } from '../../../domain';
import {
  ASIGNACION_MATERIAL_REPOSITORY,
  MATERIAL_REPOSITORY,
  type AsignacionMaterialRepository,
  type MaterialRepository,
} from '../../../infrastructure';
import { ConfirmarAsignacionMaterialDto } from '../dto';

@Injectable()
export class ConfirmarAsignacionMaterialUseCase {
  constructor(
    @Inject(ASIGNACION_MATERIAL_REPOSITORY)
    private readonly asignacionMaterialRepository: AsignacionMaterialRepository,
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(
    dto: ConfirmarAsignacionMaterialDto,
  ): Promise<AsignacionMaterial> {
    const asignacion = await this.asignacionMaterialRepository.findById(
      dto.idAsignacionMaterial,
    );

    if (!asignacion) {
      throw new NotFoundException(
        `No se encontro la asignacion de material con id ${dto.idAsignacionMaterial}.`,
      );
    }

    if (asignacion.estadoAsignacion === EstadoAsignacion.CONFIRMADA) {
      throw new ConflictException(
        'La asignacion de material ya fue confirmada.',
      );
    }

    if (!asignacion.idMaterial) {
      throw new NotFoundException(
        'La asignacion de material no tiene un material asociado.',
      );
    }

    const material = await this.materialRepository.findById(
      asignacion.idMaterial,
    );

    if (!material) {
      throw new NotFoundException(
        `No se encontro el material con id ${asignacion.idMaterial}.`,
      );
    }

    if (material.cantidadDisponible < asignacion.cantidadAsignada) {
      throw new BadRequestException(
        'No hay stock suficiente para confirmar la asignacion de material.',
      );
    }

    await this.materialRepository.update(asignacion.idMaterial, {
      cantidadDisponible:
        material.cantidadDisponible - asignacion.cantidadAsignada,
    });

    return this.asignacionMaterialRepository.update(dto.idAsignacionMaterial, {
      estadoAsignacion: EstadoAsignacion.CONFIRMADA,
    });
  }
}
