import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cliente } from '../../../domain';
import {
  CLIENTE_REPOSITORY,
  type ClienteRepository,
} from '../../../infrastructure';
import { ModificarClienteDto } from '../dto';

@Injectable()
export class ModificarClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: ClienteRepository,
  ) {}

  async execute(dto: ModificarClienteDto): Promise<Cliente> {
    const clienteActual = await this.clienteRepository.findById(dto.idCliente);

    if (!clienteActual) {
      throw new NotFoundException(
        `No se encontro el cliente con id ${dto.idCliente}.`,
      );
    }

    const correoFinal = dto.correo ?? clienteActual.correo;
    const telefonoFinal = dto.telefono ?? clienteActual.telefono;
    const cambioCorreoOTelefono =
      correoFinal !== clienteActual.correo ||
      telefonoFinal !== clienteActual.telefono;

    if (cambioCorreoOTelefono) {
      const existeDuplicado =
        await this.clienteRepository.existsByCorreoOrTelefonoExcludingId(
          correoFinal,
          telefonoFinal,
          dto.idCliente,
        );

      if (existeDuplicado) {
        throw new ConflictException(
          'Ya existe otro cliente registrado con el mismo correo o telefono.',
        );
      }
    }

    const { idCliente, ...cambios } = dto;

    return this.clienteRepository.update(idCliente, cambios);
  }
}
