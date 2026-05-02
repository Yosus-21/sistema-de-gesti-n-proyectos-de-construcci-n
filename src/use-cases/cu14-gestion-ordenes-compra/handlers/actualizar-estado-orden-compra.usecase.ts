import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrdenCompra } from '../../../domain';
import {
  ORDEN_COMPRA_REPOSITORY,
  type OrdenCompraRepository,
} from '../../../infrastructure';
import { ActualizarEstadoOrdenCompraDto } from '../dto';

@Injectable()
export class ActualizarEstadoOrdenCompraUseCase {
  constructor(
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepository,
  ) {}

  async execute(dto: ActualizarEstadoOrdenCompraDto): Promise<OrdenCompra> {
    const orden = await this.ordenCompraRepository.findById(dto.idOrdenCompra);

    if (!orden) {
      throw new NotFoundException(
        `No se encontro la orden de compra con id ${dto.idOrdenCompra}.`,
      );
    }

    return this.ordenCompraRepository.update(dto.idOrdenCompra, {
      estadoOrden: dto.estadoOrden,
    });
  }
}
