import { Injectable } from '@nestjs/common';
import {
  EliminarTareaObraFinaDto,
  ListarTareasObraFinaDto,
  ModificarTareaObraFinaDto,
  RegistrarTareaObraFinaDto,
} from './dto';
import {
  EliminarTareaObraFinaUseCase,
  ListarTareasObraFinaUseCase,
  ModificarTareaObraFinaUseCase,
  RegistrarTareaObraFinaUseCase,
} from './handlers';

@Injectable()
export class GestionTareasObraFinaService {
  constructor(
    private readonly registrarTareaObraFinaUseCase: RegistrarTareaObraFinaUseCase,
    private readonly modificarTareaObraFinaUseCase: ModificarTareaObraFinaUseCase,
    private readonly eliminarTareaObraFinaUseCase: EliminarTareaObraFinaUseCase,
    private readonly listarTareasObraFinaUseCase: ListarTareasObraFinaUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu03-gestion-tareas-obra-fina',
      status: 'ok' as const,
    };
  }

  async registrar(dto: RegistrarTareaObraFinaDto) {
    return this.registrarTareaObraFinaUseCase.execute(dto);
  }

  async modificar(dto: ModificarTareaObraFinaDto) {
    return this.modificarTareaObraFinaUseCase.execute(dto);
  }

  async eliminar(dto: EliminarTareaObraFinaDto) {
    return this.eliminarTareaObraFinaUseCase.execute(dto);
  }

  async listar(dto: ListarTareasObraFinaDto) {
    return this.listarTareasObraFinaUseCase.execute(dto);
  }
}
