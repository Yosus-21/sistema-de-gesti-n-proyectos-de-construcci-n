import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CLIENTE_REPOSITORY,
  PROYECTO_REPOSITORY,
  type ClienteRepository,
  type ProyectoRepository,
} from '../../../infrastructure';
import { EliminarClienteDto } from '../dto';

@Injectable()
export class EliminarClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: ClienteRepository,
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository,
  ) {}

  async execute(
    dto: EliminarClienteDto,
  ): Promise<{ eliminado: true; idCliente: number }> {
    const cliente = await this.clienteRepository.findById(dto.idCliente);

    if (!cliente) {
      throw new NotFoundException(
        `No se encontro el cliente con id ${dto.idCliente}.`,
      );
    }

    const tieneProyectosActivos =
      await this.proyectoRepository.existsActiveByCliente(dto.idCliente);

    if (tieneProyectosActivos) {
      throw new ConflictException(
        'No se puede eliminar el cliente porque tiene proyectos activos asociados.',
      );
    }

    await this.clienteRepository.delete(dto.idCliente);

    return {
      eliminado: true,
      idCliente: dto.idCliente,
    };
  }
}
