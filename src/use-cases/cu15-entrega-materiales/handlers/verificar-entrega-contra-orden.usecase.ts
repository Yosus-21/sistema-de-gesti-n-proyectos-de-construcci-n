import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ENTREGA_MATERIAL_REPOSITORY,
  ORDEN_COMPRA_REPOSITORY,
  type EntregaMaterialRepository,
  type OrdenCompraRepository,
} from '../../../infrastructure';
import { VerificarEntregaContraOrdenDto } from '../dto';

@Injectable()
export class VerificarEntregaContraOrdenUseCase {
  constructor(
    @Inject(ENTREGA_MATERIAL_REPOSITORY)
    private readonly entregaMaterialRepository: EntregaMaterialRepository,
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepository,
  ) {}

  async execute(dto: VerificarEntregaContraOrdenDto): Promise<{
    idEntregaMaterial: number;
    idOrdenCompra: number;
    coincide: boolean;
    cantidadEntregada?: number;
    cantidadSolicitada?: number;
    mensaje: string;
  }> {
    const entrega = await this.entregaMaterialRepository.findById(
      dto.idEntregaMaterial,
    );

    if (!entrega) {
      throw new NotFoundException(
        `No se encontro la entrega de material con id ${dto.idEntregaMaterial}.`,
      );
    }

    const ordenCompra = await this.ordenCompraRepository.findById(
      dto.idOrdenCompra,
    );

    if (!ordenCompra) {
      throw new NotFoundException(
        `No se encontro la orden de compra con id ${dto.idOrdenCompra}.`,
      );
    }

    if (entrega.idOrdenCompra !== dto.idOrdenCompra) {
      throw new BadRequestException(
        'La entrega de material no corresponde a la orden de compra indicada.',
      );
    }

    const lineas = await this.ordenCompraRepository.findLineasByOrden(
      dto.idOrdenCompra,
    );
    const lineaMaterial = lineas.find(
      (linea) => linea.idMaterial === entrega.idMaterial,
    );

    if (!lineaMaterial) {
      return {
        idEntregaMaterial: dto.idEntregaMaterial,
        idOrdenCompra: dto.idOrdenCompra,
        coincide: false,
        mensaje: 'El material entregado no pertenece a la orden de compra.',
      };
    }

    const coincide =
      entrega.cantidadEntregada <= lineaMaterial.cantidadSolicitada;

    return {
      idEntregaMaterial: dto.idEntregaMaterial,
      idOrdenCompra: dto.idOrdenCompra,
      coincide,
      cantidadEntregada: entrega.cantidadEntregada,
      cantidadSolicitada: lineaMaterial.cantidadSolicitada,
      mensaje: coincide
        ? 'La entrega coincide con la orden de compra.'
        : 'La cantidad entregada supera la cantidad solicitada en la orden de compra.',
    };
  }
}
