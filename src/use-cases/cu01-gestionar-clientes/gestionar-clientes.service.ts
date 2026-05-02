import { Injectable } from '@nestjs/common';
import {
  ConsultarClienteDto,
  EliminarClienteDto,
  ListarClientesDto,
  ModificarClienteDto,
  RegistrarClienteDto,
} from './dto';
import {
  ConsultarClienteUseCase,
  EliminarClienteUseCase,
  ListarClientesUseCase,
  ModificarClienteUseCase,
  RegistrarClienteUseCase,
} from './handlers';

@Injectable()
export class GestionarClientesService {
  constructor(
    private readonly registrarClienteUseCase: RegistrarClienteUseCase,
    private readonly modificarClienteUseCase: ModificarClienteUseCase,
    private readonly eliminarClienteUseCase: EliminarClienteUseCase,
    private readonly consultarClienteUseCase: ConsultarClienteUseCase,
    private readonly listarClientesUseCase: ListarClientesUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu01-gestionar-clientes',
      status: 'ok' as const,
    };
  }

  async registrar(dto: RegistrarClienteDto) {
    return this.registrarClienteUseCase.execute(dto);
  }

  async modificar(dto: ModificarClienteDto) {
    return this.modificarClienteUseCase.execute(dto);
  }

  async eliminar(dto: EliminarClienteDto) {
    return this.eliminarClienteUseCase.execute(dto);
  }

  async consultar(dto: ConsultarClienteDto) {
    return this.consultarClienteUseCase.execute(dto);
  }

  async listar(dto: ListarClientesDto) {
    return this.listarClientesUseCase.execute(dto);
  }
}
