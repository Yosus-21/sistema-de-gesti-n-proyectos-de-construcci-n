import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoOrdenCompra, OrdenCompra } from '../../../domain';
import {
  ORDEN_COMPRA_REPOSITORY,
  PROVEEDOR_REPOSITORY,
  type OrdenCompraRepository,
  type ProveedorRepository,
} from '../../../infrastructure';
import { CrearOrdenCompraDto } from '../dto';

@Injectable()
export class CrearOrdenCompraUseCase {
  constructor(
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepository,
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepository,
  ) {}

  async execute(dto: CrearOrdenCompraDto): Promise<OrdenCompra> {
    const proveedor = await this.proveedorRepository.findById(dto.idProveedor);

    if (!proveedor) {
      throw new NotFoundException(
        `No se encontro el proveedor con id ${dto.idProveedor}.`,
      );
    }

    const fechaOrden = new Date(dto.fechaOrden);
    const fechaEntregaEstimada = dto.fechaEntregaEstimada
      ? new Date(dto.fechaEntregaEstimada)
      : undefined;

    if (fechaEntregaEstimada && fechaEntregaEstimada < fechaOrden) {
      throw new BadRequestException(
        'La fecha de entrega estimada no puede ser anterior a la fecha de la orden.',
      );
    }

    const ordenCompra = new OrdenCompra({
      idProveedor: dto.idProveedor,
      fechaOrden,
      fechaEntregaEstimada,
      estadoOrden: EstadoOrdenCompra.BORRADOR,
    });

    return this.ordenCompraRepository.create(ordenCompra);
  }
}
