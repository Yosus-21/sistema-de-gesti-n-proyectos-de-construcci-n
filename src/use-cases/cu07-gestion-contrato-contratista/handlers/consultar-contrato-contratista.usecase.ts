import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Contrato } from '../../../domain';
import {
  CONTRATO_REPOSITORY,
  type ContratoRepository,
} from '../../../infrastructure';
import { ConsultarContratoContratistaDto } from '../dto';

@Injectable()
export class ConsultarContratoContratistaUseCase {
  constructor(
    @Inject(CONTRATO_REPOSITORY)
    private readonly contratoRepository: ContratoRepository,
  ) {}

  async execute(dto: ConsultarContratoContratistaDto): Promise<Contrato> {
    const contrato = await this.contratoRepository.findById(dto.idContrato);

    if (!contrato) {
      throw new NotFoundException(
        `No se encontro el contrato con id ${dto.idContrato}.`,
      );
    }

    return contrato;
  }
}
