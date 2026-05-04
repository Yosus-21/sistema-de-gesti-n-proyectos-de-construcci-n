import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntregaMaterial, EstadoOrdenCompra } from '../../../domain';
import {
  ENTREGA_MATERIAL_REPOSITORY,
  MATERIAL_REPOSITORY,
  ORDEN_COMPRA_REPOSITORY,
  type EntregaMaterialRepository,
  type MaterialRepository,
  type OrdenCompraRepository,
} from '../../../infrastructure';
import { ConfirmarRecepcionMaterialDto } from '../dto';

@Injectable()
export class ConfirmarRecepcionMaterialUseCase {
  constructor(
    @Inject(ENTREGA_MATERIAL_REPOSITORY)
    private readonly entregaMaterialRepository: EntregaMaterialRepository,
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepository,
  ) {}

  async execute(dto: ConfirmarRecepcionMaterialDto): Promise<EntregaMaterial> {
    const entrega = await this.entregaMaterialRepository.findById(
      dto.idEntregaMaterial,
    );

    if (!entrega) {
      throw new NotFoundException(
        `No se encontro la entrega de material con id ${dto.idEntregaMaterial}.`,
      );
    }

    if (entrega.estadoEntrega === 'RECIBIDA') {
      throw new ConflictException(
        'La entrega de material ya fue confirmada como recibida.',
      );
    }

    if (!entrega.idMaterial) {
      throw new NotFoundException(
        'La entrega de material no tiene un material asociado.',
      );
    }

    const material = await this.materialRepository.findById(entrega.idMaterial);

    if (!material) {
      throw new NotFoundException(
        `No se encontro el material con id ${entrega.idMaterial}.`,
      );
    }

    await this.materialRepository.update(entrega.idMaterial, {
      cantidadDisponible:
        material.cantidadDisponible + entrega.cantidadEntregada,
    });

    const entregaActualizada = await this.entregaMaterialRepository.update(
      dto.idEntregaMaterial,
      {
        estadoEntrega: 'RECIBIDA',
      },
    );

    if (entregaActualizada.idOrdenCompra !== undefined) {
      await this.actualizarEstadoOrdenSiCorresponde(
        entregaActualizada.idOrdenCompra,
      );
    }

    return entregaActualizada;
  }

  private async actualizarEstadoOrdenSiCorresponde(
    idOrdenCompra: number,
  ): Promise<void> {
    const ordenCompra =
      await this.ordenCompraRepository.findById(idOrdenCompra);

    if (
      !ordenCompra ||
      ordenCompra.estadoOrden === EstadoOrdenCompra.CANCELADA
    ) {
      return;
    }

    const lineas =
      await this.ordenCompraRepository.findLineasByOrden(idOrdenCompra);

    if (lineas.length === 0) {
      return;
    }

    const entregasRecibidas = await this.entregaMaterialRepository.findMany({
      idOrdenCompra,
      estadoEntrega: 'RECIBIDA',
    });

    const cantidadRecibidaPorMaterial = new Map<number, number>();

    for (const entrega of entregasRecibidas) {
      if (entrega.idMaterial === undefined) {
        continue;
      }

      const cantidadActual =
        cantidadRecibidaPorMaterial.get(entrega.idMaterial) ?? 0;
      cantidadRecibidaPorMaterial.set(
        entrega.idMaterial,
        cantidadActual + entrega.cantidadEntregada,
      );
    }

    const ordenCompleta = lineas.every((linea) => {
      if (linea.idMaterial === undefined) {
        return false;
      }

      return (
        (cantidadRecibidaPorMaterial.get(linea.idMaterial) ?? 0) >=
        linea.cantidadSolicitada
      );
    });

    if (
      ordenCompleta &&
      ordenCompra.estadoOrden !== EstadoOrdenCompra.RECIBIDA
    ) {
      await this.ordenCompraRepository.update(idOrdenCompra, {
        estadoOrden: EstadoOrdenCompra.RECIBIDA,
      });
    }
  }
}
