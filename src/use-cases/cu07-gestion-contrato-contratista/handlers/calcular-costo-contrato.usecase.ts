import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CONTRATO_REPOSITORY,
  type ContratoRepository,
} from '../../../infrastructure';
import { CalcularCostoContratoDto } from '../dto';

export type CalcularCostoContratoResult = {
  idContrato: number;
  costoTotal: number;
};

@Injectable()
export class CalcularCostoContratoUseCase {
  constructor(
    @Inject(CONTRATO_REPOSITORY)
    private readonly contratoRepository: ContratoRepository,
  ) {}

  async execute(
    dto: CalcularCostoContratoDto,
  ): Promise<CalcularCostoContratoResult> {
    const contrato = await this.contratoRepository.findById(dto.idContrato);

    if (!contrato) {
      throw new NotFoundException(
        `No se encontro el contrato con id ${dto.idContrato}.`,
      );
    }

    let costoTotal = contrato.costoTotal;

    if (contrato.detalles && contrato.detalles.length > 0) {
      const diasContrato = Math.max(
        1,
        Math.ceil(
          (contrato.fechaFin.getTime() - contrato.fechaInicio.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );

      const costoDiario = contrato.detalles.reduce(
        (total, detalle) =>
          total + detalle.cantidadPersonas * detalle.costoUnitarioPorDia,
        0,
      );

      const nuevoCosto = diasContrato * costoDiario;

      if (nuevoCosto !== contrato.costoTotal) {
        await this.contratoRepository.update(dto.idContrato, {
          costoTotal: nuevoCosto,
        });
        costoTotal = nuevoCosto;
      }
    }

    return {
      idContrato: dto.idContrato,
      costoTotal,
    };
  }
}
