import { Injectable } from '@nestjs/common';
import {
  ConsultarTrabajadorDto,
  EliminarTrabajadorDto,
  ListarTrabajadoresDto,
  ModificarTrabajadorDto,
  RegistrarTrabajadorDto,
  VerificarDisponibilidadTrabajadorDto,
} from './dto';
import {
  ConsultarTrabajadorUseCase,
  EliminarTrabajadorUseCase,
  ListarTrabajadoresUseCase,
  ModificarTrabajadorUseCase,
  RegistrarTrabajadorUseCase,
  VerificarDisponibilidadTrabajadorUseCase,
} from './handlers';

@Injectable()
export class GestionTrabajadorService {
  constructor(
    private readonly registrarTrabajadorUseCase: RegistrarTrabajadorUseCase,
    private readonly modificarTrabajadorUseCase: ModificarTrabajadorUseCase,
    private readonly eliminarTrabajadorUseCase: EliminarTrabajadorUseCase,
    private readonly consultarTrabajadorUseCase: ConsultarTrabajadorUseCase,
    private readonly listarTrabajadoresUseCase: ListarTrabajadoresUseCase,
    private readonly verificarDisponibilidadTrabajadorUseCase: VerificarDisponibilidadTrabajadorUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu08-gestion-trabajador',
      status: 'ok' as const,
    };
  }

  async registrar(dto: RegistrarTrabajadorDto) {
    return this.registrarTrabajadorUseCase.execute(dto);
  }

  async modificar(dto: ModificarTrabajadorDto) {
    return this.modificarTrabajadorUseCase.execute(dto);
  }

  async eliminar(dto: EliminarTrabajadorDto) {
    return this.eliminarTrabajadorUseCase.execute(dto);
  }

  async consultar(dto: ConsultarTrabajadorDto) {
    return this.consultarTrabajadorUseCase.execute(dto);
  }

  async listar(dto: ListarTrabajadoresDto) {
    return this.listarTrabajadoresUseCase.execute(dto);
  }

  async verificarDisponibilidad(dto: VerificarDisponibilidadTrabajadorDto) {
    return this.verificarDisponibilidadTrabajadorUseCase.execute(dto);
  }
}
