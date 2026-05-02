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
import { AjustarAsignacionMaterialDto } from '../dto';

@Injectable()
export class AjustarAsignacionMaterialUseCase {
  constructor(
    @Inject(ASIGNACION_MATERIAL_REPOSITORY)
    private readonly asignacionMaterialRepository: AsignacionMaterialRepository,
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(
    dto: AjustarAsignacionMaterialDto,
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
        'No se puede ajustar una asignacion de material ya confirmada.',
      );
    }

    if (dto.cantidadAsignada !== undefined && dto.cantidadAsignada <= 0) {
      throw new BadRequestException(
        'La cantidad asignada debe ser mayor a cero.',
      );
    }

    if (
      dto.costoMaximoPermitido !== undefined &&
      dto.costoMaximoPermitido < 0
    ) {
      throw new BadRequestException(
        'El costo máximo permitido no puede ser negativo.',
      );
    }

    if (dto.cantidadAsignada !== undefined && asignacion.idMaterial) {
      const material = await this.materialRepository.findById(
        asignacion.idMaterial,
      );

      if (!material) {
        throw new NotFoundException(
          `No se encontro el material con id ${asignacion.idMaterial}.`,
        );
      }

      if (material.cantidadDisponible < dto.cantidadAsignada) {
        throw new BadRequestException(
          'No hay stock suficiente para ajustar la asignacion de material.',
        );
      }
    }

    return this.asignacionMaterialRepository.update(dto.idAsignacionMaterial, {
      cantidadAsignada: dto.cantidadAsignada,
      costoMaximoPermitido: dto.costoMaximoPermitido,
      restricciones: dto.restricciones,
    });
  }
}
