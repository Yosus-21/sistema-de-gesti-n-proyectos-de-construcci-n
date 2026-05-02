import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntregaMaterial } from '../../../domain';
import {
  ENTREGA_MATERIAL_REPOSITORY,
  type EntregaMaterialRepository,
} from '../../../infrastructure';
import { ConsultarEntregaMaterialDto } from '../dto';

@Injectable()
export class ConsultarEntregaMaterialUseCase {
  constructor(
    @Inject(ENTREGA_MATERIAL_REPOSITORY)
    private readonly entregaMaterialRepository: EntregaMaterialRepository,
  ) {}

  async execute(dto: ConsultarEntregaMaterialDto): Promise<EntregaMaterial> {
    const entrega = await this.entregaMaterialRepository.findById(
      dto.idEntregaMaterial,
    );

    if (!entrega) {
      throw new NotFoundException(
        `No se encontro la entrega de material con id ${dto.idEntregaMaterial}.`,
      );
    }

    return entrega;
  }
}
