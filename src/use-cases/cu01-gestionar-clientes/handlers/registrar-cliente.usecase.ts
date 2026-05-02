import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Cliente } from '../../../domain';
import {
  CLIENTE_REPOSITORY,
  type ClienteRepository,
} from '../../../infrastructure';
import { RegistrarClienteDto } from '../dto';

@Injectable()
export class RegistrarClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: ClienteRepository,
  ) {}

  async execute(dto: RegistrarClienteDto): Promise<Cliente> {
    const yaExiste = await this.clienteRepository.existsByCorreoOrTelefono(
      dto.correo,
      dto.telefono,
    );

    if (yaExiste) {
      throw new ConflictException(
        'Ya existe un cliente registrado con el mismo correo o telefono.',
      );
    }

    const cliente = new Cliente({
      nombre: dto.nombre,
      direccion: dto.direccion,
      telefono: dto.telefono,
      correo: dto.correo,
      tipoCliente: dto.tipoCliente,
    });

    return this.clienteRepository.create(cliente);
  }
}
