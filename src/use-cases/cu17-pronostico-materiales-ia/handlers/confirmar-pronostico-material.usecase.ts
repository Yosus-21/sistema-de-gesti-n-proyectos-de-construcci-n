import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PronosticoMaterial } from '../../../domain';
import {
  PRONOSTICO_MATERIAL_REPOSITORY,
  type PronosticoMaterialRepository,
} from '../../../infrastructure';
import { ConfirmarPronosticoMaterialDto } from '../dto';

@Injectable()
export class ConfirmarPronosticoMaterialUseCase {
  constructor(
    @Inject(PRONOSTICO_MATERIAL_REPOSITORY)
    private readonly pronosticoMaterialRepository: PronosticoMaterialRepository,
  ) {}

  async execute(
    dto: ConfirmarPronosticoMaterialDto,
  ): Promise<PronosticoMaterial> {
    const pronostico = await this.pronosticoMaterialRepository.findById(
      dto.idPronosticoMaterial,
    );

    if (!pronostico) {
      throw new NotFoundException(
        `No se encontro el pronóstico de material con id ${dto.idPronosticoMaterial}.`,
      );
    }

    const mensajeConfirmacion =
      'Pronóstico confirmado para planificación de compras.';
    const observacionesActualizadas = pronostico.observaciones
      ? `${pronostico.observaciones} ${mensajeConfirmacion}`.trim()
      : mensajeConfirmacion;

    return this.pronosticoMaterialRepository.update(dto.idPronosticoMaterial, {
      observaciones: observacionesActualizadas,
    });
  }
}
