import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ORDEN_COMPRA_REPOSITORY,
  type OrdenCompraRepository,
} from '../../../infrastructure';
import { CalcularMontoTotalOrdenCompraDto } from '../dto';

@Injectable()
export class CalcularMontoTotalOrdenCompraUseCase {
  constructor(
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepository,
  ) {}

  async execute(dto: CalcularMontoTotalOrdenCompraDto): Promise<{
    idOrdenCompra: number;
    montoTotal: number;
  }> {
    const orden = await this.ordenCompraRepository.findById(dto.idOrdenCompra);

    if (!orden) {
      throw new NotFoundException(
        `No se encontro la orden de compra con id ${dto.idOrdenCompra}.`,
      );
    }

    const montoTotal = await this.ordenCompraRepository.calcularMontoTotal(
      dto.idOrdenCompra,
    );

    return {
      idOrdenCompra: dto.idOrdenCompra,
      montoTotal,
    };
  }
}
