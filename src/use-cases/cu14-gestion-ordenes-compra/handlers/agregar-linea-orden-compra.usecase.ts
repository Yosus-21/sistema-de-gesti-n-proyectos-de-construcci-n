import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LineaOrdenCompra } from '../../../domain';
import {
  MATERIAL_REPOSITORY,
  ORDEN_COMPRA_REPOSITORY,
  type MaterialRepository,
  type OrdenCompraRepository,
} from '../../../infrastructure';
import { AgregarLineaOrdenCompraDto } from '../dto';

@Injectable()
export class AgregarLineaOrdenCompraUseCase {
  constructor(
    @Inject(ORDEN_COMPRA_REPOSITORY)
    private readonly ordenCompraRepository: OrdenCompraRepository,
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(dto: AgregarLineaOrdenCompraDto): Promise<LineaOrdenCompra> {
    const orden = await this.ordenCompraRepository.findById(dto.idOrdenCompra);

    if (!orden) {
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

    if (dto.cantidadSolicitada <= 0) {
      throw new BadRequestException(
        'La cantidad solicitada debe ser mayor a cero.',
      );
    }

    if (dto.precioUnitarioAcordado < 0) {
      throw new BadRequestException(
        'El precio unitario acordado no puede ser negativo.',
      );
    }

    const linea = new LineaOrdenCompra({
      idOrdenCompra: dto.idOrdenCompra,
      idMaterial: dto.idMaterial,
      cantidadSolicitada: dto.cantidadSolicitada,
      precioUnitarioAcordado: dto.precioUnitarioAcordado,
      estadoLinea: 'PENDIENTE',
    });

    return this.ordenCompraRepository.addLinea(linea);
  }
}
