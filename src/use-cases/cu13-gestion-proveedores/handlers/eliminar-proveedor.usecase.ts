import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PROVEEDOR_REPOSITORY,
  type ProveedorRepository,
} from '../../../infrastructure';
import { EliminarProveedorDto } from '../dto';

@Injectable()
export class EliminarProveedorUseCase {
  constructor(
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepository,
  ) {}

  async execute(
    dto: EliminarProveedorDto,
  ): Promise<{ eliminado: true; idProveedor: number }> {
    const proveedor = await this.proveedorRepository.findById(dto.idProveedor);

    if (!proveedor) {
      throw new NotFoundException(
        `No se encontro el proveedor con id ${dto.idProveedor}.`,
      );
    }

    await this.proveedorRepository.delete(dto.idProveedor);

    return {
      eliminado: true,
      idProveedor: dto.idProveedor,
    };
  }
}
