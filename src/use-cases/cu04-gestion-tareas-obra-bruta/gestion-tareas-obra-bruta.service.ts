import { Injectable } from '@nestjs/common';
import {
  EliminarTareaObraBrutaDto,
  ListarTareasObraBrutaDto,
  ModificarTareaObraBrutaDto,
  RegistrarTareaObraBrutaDto,
} from './dto';
import {
  EliminarTareaObraBrutaUseCase,
  ListarTareasObraBrutaUseCase,
  ModificarTareaObraBrutaUseCase,
  RegistrarTareaObraBrutaUseCase,
} from './handlers';

@Injectable()
export class GestionTareasObraBrutaService {
  constructor(
    private readonly registrarTareaObraBrutaUseCase: RegistrarTareaObraBrutaUseCase,
    private readonly modificarTareaObraBrutaUseCase: ModificarTareaObraBrutaUseCase,
    private readonly eliminarTareaObraBrutaUseCase: EliminarTareaObraBrutaUseCase,
    private readonly listarTareasObraBrutaUseCase: ListarTareasObraBrutaUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu04-gestion-tareas-obra-bruta',
      status: 'ok' as const,
    };
  }

  async registrar(dto: RegistrarTareaObraBrutaDto) {
    return this.registrarTareaObraBrutaUseCase.execute(dto);
  }

  async modificar(dto: ModificarTareaObraBrutaDto) {
    return this.modificarTareaObraBrutaUseCase.execute(dto);
  }

  async eliminar(dto: EliminarTareaObraBrutaDto) {
    return this.eliminarTareaObraBrutaUseCase.execute(dto);
  }

  async listar(dto: ListarTareasObraBrutaDto) {
    return this.listarTareasObraBrutaUseCase.execute(dto);
  }
}
