import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrdenCompra } from '../../../domain';
import {
  ORDEN_COMPRA_REPOSITORY,
  type OrdenCompraRepository,
} from '../../../infrastructure';
import { ConsultarOrdenCompraDto } from '../dto';

@Injectable()
export class ConsultarOrdenCompraUseCase {
  constructor(
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepository,
  ) {}

  async execute(dto: ConsultarOrdenCompraDto): Promise<OrdenCompra> {
    const orden = await this.ordenCompraRepository.findById(dto.idOrdenCompra);

    if (!orden) {
      throw new NotFoundException(
        `No se encontro la orden de compra con id ${dto.idOrdenCompra}.`,
      );
    }

    return orden;
  }
}
