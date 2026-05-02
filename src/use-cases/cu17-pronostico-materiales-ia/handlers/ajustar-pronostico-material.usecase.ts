import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PronosticoMaterial } from '../../../domain';
import {
  PRONOSTICO_MATERIAL_REPOSITORY,
  type PronosticoMaterialRepository,
} from '../../../infrastructure';
import { AjustarPronosticoMaterialDto } from '../dto';

@Injectable()
export class AjustarPronosticoMaterialUseCase {
  constructor(
    @Inject(PRONOSTICO_MATERIAL_REPOSITORY)
    private readonly pronosticoMaterialRepository: PronosticoMaterialRepository,
  ) {}

  async execute(
    dto: AjustarPronosticoMaterialDto,
  ): Promise<PronosticoMaterial> {
    const pronostico = await this.pronosticoMaterialRepository.findById(
      dto.idPronosticoMaterial,
    );

    if (!pronostico) {
      throw new NotFoundException(
        `No se encontro el pronóstico de material con id ${dto.idPronosticoMaterial}.`,
      );
    }

    if (dto.stockMinimo !== undefined && dto.stockMinimo < 0) {
      throw new BadRequestException('El stock mínimo no puede ser negativo.');
    }

    if (dto.stockMaximo !== undefined && dto.stockMaximo < 0) {
      throw new BadRequestException('El stock máximo no puede ser negativo.');
    }

    const stockMinimoFinal = dto.stockMinimo ?? pronostico.stockMinimo;
    const stockMaximoFinal = dto.stockMaximo ?? pronostico.stockMaximo;

    if (stockMaximoFinal < stockMinimoFinal) {
      throw new BadRequestException(
        'El stock máximo final no puede ser menor que el stock mínimo final.',
      );
    }

    const stocksFueronAjustados =
      dto.stockMinimo !== undefined || dto.stockMaximo !== undefined;

    return this.pronosticoMaterialRepository.update(dto.idPronosticoMaterial, {
      stockMinimo: dto.stockMinimo,
      stockMaximo: dto.stockMaximo,
      observaciones: dto.observaciones,
      nivelConfianza: stocksFueronAjustados ? 80 : pronostico.nivelConfianza,
    });
  }
}
