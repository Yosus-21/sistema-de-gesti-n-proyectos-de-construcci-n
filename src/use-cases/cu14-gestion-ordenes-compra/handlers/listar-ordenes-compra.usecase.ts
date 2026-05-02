import { Inject, Injectable } from '@nestjs/common';
import { OrdenCompra } from '../../../domain';
import {
  ORDEN_COMPRA_REPOSITORY,
  type OrdenCompraRepository,
} from '../../../infrastructure';
import { ListarOrdenesCompraDto } from '../dto';

@Injectable()
export class ListarOrdenesCompraUseCase {
  constructor(
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepository,
  ) {}

  async execute(dto: ListarOrdenesCompraDto): Promise<OrdenCompra[]> {
    return this.ordenCompraRepository.findMany({
      idProveedor: dto.idProveedor,
      estadoOrden: dto.estadoOrden,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
