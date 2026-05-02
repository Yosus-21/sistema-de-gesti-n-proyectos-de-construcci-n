import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cliente } from '../../../domain';
import {
  CLIENTE_REPOSITORY,
  type ClienteRepository,
} from '../../../infrastructure';
import { ConsultarClienteDto } from '../dto';

@Injectable()
export class ConsultarClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: ClienteRepository,
  ) {}

  async execute(dto: ConsultarClienteDto): Promise<Cliente> {
    const cliente = await this.clienteRepository.findById(dto.idCliente);

    if (!cliente) {
      throw new NotFoundException(
        `No se encontro el cliente con id ${dto.idCliente}.`,
      );
    }

    return cliente;
  }
}
