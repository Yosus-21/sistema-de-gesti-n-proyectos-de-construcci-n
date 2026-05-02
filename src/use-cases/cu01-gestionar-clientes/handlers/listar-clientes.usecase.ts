import { Inject, Injectable } from '@nestjs/common';
import { Cliente } from '../../../domain';
import {
  CLIENTE_REPOSITORY,
  type ClienteRepository,
} from '../../../infrastructure';
import { ListarClientesDto } from '../dto';

@Injectable()
export class ListarClientesUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: ClienteRepository,
  ) {}

  async execute(dto: ListarClientesDto): Promise<Cliente[]> {
    return this.clienteRepository.findMany({
      busqueda: dto.busqueda,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
