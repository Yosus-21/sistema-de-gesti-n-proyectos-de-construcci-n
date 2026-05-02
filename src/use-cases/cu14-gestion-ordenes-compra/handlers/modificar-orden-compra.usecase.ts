import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrdenCompra } from '../../../domain';
import {
  ORDEN_COMPRA_REPOSITORY,
  PROVEEDOR_REPOSITORY,
  type OrdenCompraRepository,
  type ProveedorRepository,
} from '../../../infrastructure';
import { ModificarOrdenCompraDto } from '../dto';

@Injectable()
export class ModificarOrdenCompraUseCase {
  constructor(
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepository,
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepository,
  ) {}

  async execute(dto: ModificarOrdenCompraDto): Promise<OrdenCompra> {
    const orden = await this.ordenCompraRepository.findById(dto.idOrdenCompra);

    if (!orden) {
      throw new NotFoundException(
        `No se encontro la orden de compra con id ${dto.idOrdenCompra}.`,
      );
    }

    if (dto.idProveedor !== undefined) {
      const proveedor = await this.proveedorRepository.findById(
        dto.idProveedor,
      );

      if (!proveedor) {
        throw new NotFoundException(
          `No se encontro el proveedor con id ${dto.idProveedor}.`,
        );
      }
    }

    const fechaOrden = dto.fechaOrden
      ? new Date(dto.fechaOrden)
      : orden.fechaOrden;
    const fechaEntregaEstimada = dto.fechaEntregaEstimada
      ? new Date(dto.fechaEntregaEstimada)
      : orden.fechaEntregaEstimada;

    if (fechaEntregaEstimada && fechaEntregaEstimada < fechaOrden) {
      throw new BadRequestException(
        'La fecha de entrega estimada no puede ser anterior a la fecha de la orden.',
      );
    }

    const { idOrdenCompra, ...resto } = dto;

    return this.ordenCompraRepository.update(idOrdenCompra, {
      ...resto,
      fechaOrden: dto.fechaOrden ? fechaOrden : undefined,
      fechaEntregaEstimada: dto.fechaEntregaEstimada
        ? fechaEntregaEstimada
        : undefined,
    });
  }
}
