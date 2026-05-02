import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntregaMaterial } from '../../../domain';
import {
  ENTREGA_MATERIAL_REPOSITORY,
  MATERIAL_REPOSITORY,
  ORDEN_COMPRA_REPOSITORY,
  type EntregaMaterialRepository,
  type MaterialRepository,
  type OrdenCompraRepository,
} from '../../../infrastructure';
import { RegistrarEntregaMaterialDto } from '../dto';

@Injectable()
export class RegistrarEntregaMaterialUseCase {
  constructor(
    @Inject(ENTREGA_MATERIAL_REPOSITORY)
    private readonly entregaMaterialRepository: EntregaMaterialRepository,
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepository,
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(dto: RegistrarEntregaMaterialDto): Promise<EntregaMaterial> {
    const ordenCompra = await this.ordenCompraRepository.findById(
      dto.idOrdenCompra,
    );

    if (!ordenCompra) {
      throw new NotFoundException(
        `No se encontro la orden de compra con id ${dto.idOrdenCompra}.`,
      );
    }

    const material = await this.materialRepository.findById(dto.idMaterial);

    if (!material) {
      throw new NotFoundException(
        `No se encontro el material con id ${dto.idMaterial}.`,
      );
    }

    if (dto.cantidadEntregada <= 0) {
      throw new BadRequestException(
        'La cantidad entregada debe ser mayor a cero.',
      );
    }

    const fechaEntrega = new Date(dto.fechaEntrega);

    if (Number.isNaN(fechaEntrega.getTime())) {
      throw new BadRequestException('La fecha de entrega no es válida.');
    }

    const lineas = await this.ordenCompraRepository.findLineasByOrden(
      dto.idOrdenCompra,
    );
    const lineaMaterial = lineas.find(
      (linea) => linea.idMaterial === dto.idMaterial,
    );

    if (!lineaMaterial) {
      throw new BadRequestException(
        'El material entregado no pertenece a la orden de compra.',
      );
    }

    if (dto.cantidadEntregada > lineaMaterial.cantidadSolicitada) {
      throw new BadRequestException(
        'La cantidad entregada no puede superar la cantidad solicitada en la orden de compra.',
      );
    }

    const entrega = new EntregaMaterial({
      idOrdenCompra: dto.idOrdenCompra,
      idMaterial: dto.idMaterial,
      fechaEntrega,
      cantidadEntregada: dto.cantidadEntregada,
      estadoEntrega: dto.estadoEntrega || 'REGISTRADA',
      observaciones: dto.observaciones,
    });

    return this.entregaMaterialRepository.create(entrega);
  }
}
