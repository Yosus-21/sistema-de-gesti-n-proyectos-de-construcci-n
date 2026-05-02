import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  MATERIAL_REPOSITORY,
  PRONOSTICO_MATERIAL_REPOSITORY,
  type MaterialRepository,
  type PronosticoMaterialRepository,
} from '../../../infrastructure';
import { CalcularNivelConfianzaPronosticoDto } from '../dto';

@Injectable()
export class CalcularNivelConfianzaPronosticoUseCase {
  constructor(
    @Inject(PRONOSTICO_MATERIAL_REPOSITORY)
    private readonly pronosticoMaterialRepository: PronosticoMaterialRepository,
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(dto: CalcularNivelConfianzaPronosticoDto): Promise<{
    idPronosticoMaterial: number;
    nivelConfianza: number;
    mensaje: string;
  }> {
    const pronostico = await this.pronosticoMaterialRepository.findById(
      dto.idPronosticoMaterial,
    );

    if (!pronostico) {
      throw new NotFoundException(
        `No se encontro el pronóstico de material con id ${dto.idPronosticoMaterial}.`,
      );
    }

    let nivelConfianza = pronostico.nivelConfianza ?? 70;

    if (pronostico.idMaterial !== undefined) {
      const material = await this.materialRepository.findById(
        pronostico.idMaterial,
      );

      if (!material) {
        throw new NotFoundException(
          `No se encontro el material con id ${pronostico.idMaterial}.`,
        );
      }

      if (
        material.cantidadDisponible >= pronostico.stockMinimo &&
        material.cantidadDisponible <= pronostico.stockMaximo
      ) {
        nivelConfianza = 85;
      } else if (material.cantidadDisponible < pronostico.stockMinimo) {
        nivelConfianza = 60;
      } else if (material.cantidadDisponible > pronostico.stockMaximo) {
        nivelConfianza = 75;
      }
    }

    await this.pronosticoMaterialRepository.update(dto.idPronosticoMaterial, {
      nivelConfianza,
    });

    return {
      idPronosticoMaterial: dto.idPronosticoMaterial,
      nivelConfianza,
      mensaje: 'Nivel de confianza calculado con heurística provisional.',
    };
  }
}
