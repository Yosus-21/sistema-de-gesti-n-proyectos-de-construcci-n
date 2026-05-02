import { Injectable } from '@nestjs/common';
import {
  CambiarEstadoProyectoDto,
  ConsultarProyectoDto,
  CrearProyectoDto,
  ListarProyectosDto,
} from './dto';
import {
  CambiarEstadoProyectoUseCase,
  ConsultarProyectoUseCase,
  CrearProyectoUseCase,
  ListarProyectosUseCase,
} from './handlers';

@Injectable()
export class CreacionProyectosService {
  constructor(
    private readonly crearProyectoUseCase: CrearProyectoUseCase,
    private readonly consultarProyectoUseCase: ConsultarProyectoUseCase,
    private readonly listarProyectosUseCase: ListarProyectosUseCase,
    private readonly cambiarEstadoProyectoUseCase: CambiarEstadoProyectoUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu02-creacion-proyectos',
      status: 'ok' as const,
    };
  }

  async crear(dto: CrearProyectoDto) {
    return this.crearProyectoUseCase.execute(dto);
  }

  async consultar(dto: ConsultarProyectoDto) {
    return this.consultarProyectoUseCase.execute(dto);
  }

  async listar(dto: ListarProyectosDto) {
    return this.listarProyectosUseCase.execute(dto);
  }

  async cambiarEstado(dto: CambiarEstadoProyectoDto) {
    return this.cambiarEstadoProyectoUseCase.execute(dto);
  }
}
