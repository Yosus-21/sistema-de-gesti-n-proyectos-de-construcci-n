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

    return {
      idContrato: dto.idContrato,
      costoTotal: contrato.costoTotal,
    };
  }
}
