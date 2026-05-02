import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Proveedor } from '../../../domain';
import {
  PROVEEDOR_REPOSITORY,
  type ProveedorRepository,
} from '../../../infrastructure';
import { RegistrarProveedorDto } from '../dto';

@Injectable()
export class RegistrarProveedorUseCase {
  constructor(
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepository,
  ) {}

  async execute(dto: RegistrarProveedorDto): Promise<Proveedor> {
    const yaExiste = await this.proveedorRepository.existsByNombreOrCorreo(
      dto.nombre,
      dto.correo,
    );

    if (yaExiste) {
      throw new ConflictException(
        'Ya existe un proveedor registrado con el mismo nombre o correo.',
      );
    }

    const proveedor = new Proveedor({
      nombre: dto.nombre,
      direccion: dto.direccion,
      telefono: dto.telefono,
      correo: dto.correo,
      terminosEntrega: dto.terminosEntrega,
    });

    return this.proveedorRepository.create(proveedor);
  }
}
