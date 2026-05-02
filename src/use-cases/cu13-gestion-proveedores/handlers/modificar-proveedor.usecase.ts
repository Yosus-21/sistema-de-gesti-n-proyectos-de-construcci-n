import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Proveedor } from '../../../domain';
import {
  PROVEEDOR_REPOSITORY,
  type ProveedorRepository,
} from '../../../infrastructure';
import { ModificarProveedorDto } from '../dto';

@Injectable()
export class ModificarProveedorUseCase {
  constructor(
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepository,
  ) {}

  async execute(dto: ModificarProveedorDto): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findById(dto.idProveedor);

    if (!proveedor) {
      throw new NotFoundException(
        `No se encontro el proveedor con id ${dto.idProveedor}.`,
      );
    }

    const nombre = dto.nombre ?? proveedor.nombre;
    const correo = dto.correo ?? proveedor.correo;
    const cambiaNombreOCorreo =
      dto.nombre !== undefined || dto.correo !== undefined;

    if (cambiaNombreOCorreo) {
      const yaExiste =
        await this.proveedorRepository.existsByNombreOrCorreoExcludingId(
          nombre,
          correo,
          dto.idProveedor,
        );

      if (yaExiste) {
        throw new ConflictException(
          'Ya existe otro proveedor registrado con el mismo nombre o correo.',
        );
      }
    }

    const { idProveedor, ...cambios } = dto;

    return this.proveedorRepository.update(idProveedor, cambios);
  }
}
