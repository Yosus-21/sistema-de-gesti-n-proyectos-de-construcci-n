import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Proveedor } from '../../../domain';
import {
  PROVEEDOR_REPOSITORY,
  type ProveedorRepository,
} from '../../../infrastructure';
import { ConsultarProveedorDto } from '../dto';

@Injectable()
export class ConsultarProveedorUseCase {
  constructor(
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepository,
  ) {}

  async execute(dto: ConsultarProveedorDto): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findById(dto.idProveedor);

    if (!proveedor) {
      throw new NotFoundException(
        `No se encontro el proveedor con id ${dto.idProveedor}.`,
      );
    }

    return proveedor;
  }
}
