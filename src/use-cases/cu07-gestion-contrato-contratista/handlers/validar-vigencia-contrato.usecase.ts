import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CONTRATO_REPOSITORY,
  type ContratoRepository,
} from '../../../infrastructure';
import { ValidarVigenciaContratoDto } from '../dto';

export type ValidarVigenciaContratoResult = {
  idContrato: number;
  vigente: boolean;
  fechaReferencia: string;
};

@Injectable()
export class ValidarVigenciaContratoUseCase {
  constructor(
    @Inject(CONTRATO_REPOSITORY)
    private readonly contratoRepository: ContratoRepository,
  ) {}

  async execute(
    dto: ValidarVigenciaContratoDto,
  ): Promise<ValidarVigenciaContratoResult> {
    const contrato = await this.contratoRepository.findById(dto.idContrato);

    if (!contrato) {
      throw new NotFoundException(
        `No se encontro el contrato con id ${dto.idContrato}.`,
      );
    }

    const fechaReferencia = dto.fechaReferencia
      ? new Date(dto.fechaReferencia)
      : new Date();

    const vigente =
      fechaReferencia.getTime() >= contrato.fechaInicio.getTime() &&
      fechaReferencia.getTime() <= contrato.fechaFin.getTime();

    return {
      idContrato: dto.idContrato,
      vigente,
      fechaReferencia: fechaReferencia.toISOString(),
    };
  }
}
