import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PROVEEDOR_REPOSITORY,
  type ProveedorRepository,
} from '../../../infrastructure';
import { ValidarProveedorDto } from '../dto';

@Injectable()
export class ValidarProveedorUseCase {
  constructor(
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepository,
  ) {}

  async execute(dto: ValidarProveedorDto): Promise<{
    idProveedor: number;
    valido: true;
    mensaje: string;
  }> {
    const proveedor = await this.proveedorRepository.findById(dto.idProveedor);

    if (!proveedor) {
      throw new NotFoundException(
        `No se encontro el proveedor con id ${dto.idProveedor}.`,
      );
    }

    return {
      idProveedor: dto.idProveedor,
      valido: true,
      mensaje: 'Proveedor registrado y disponible para órdenes de compra.',
    };
  }
}
