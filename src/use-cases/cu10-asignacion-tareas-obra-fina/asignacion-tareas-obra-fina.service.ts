import { Injectable } from '@nestjs/common';
import {
  AsignarTareaObraFinaDto,
  CancelarAsignacionObraFinaDto,
  ConsultarAsignacionObraFinaDto,
  ListarAsignacionesObraFinaDto,
  ModificarAsignacionObraFinaDto,
} from './dto';
import {
  AsignarTareaObraFinaUseCase,
  CancelarAsignacionObraFinaUseCase,
  ConsultarAsignacionObraFinaUseCase,
  ListarAsignacionesObraFinaUseCase,
  ModificarAsignacionObraFinaUseCase,
} from './handlers';

@Injectable()
export class AsignacionTareasObraFinaService {
  constructor(
    private readonly asignarTareaObraFinaUseCase: AsignarTareaObraFinaUseCase,
    private readonly modificarAsignacionObraFinaUseCase: ModificarAsignacionObraFinaUseCase,
    private readonly cancelarAsignacionObraFinaUseCase: CancelarAsignacionObraFinaUseCase,
    private readonly consultarAsignacionObraFinaUseCase: ConsultarAsignacionObraFinaUseCase,
    private readonly listarAsignacionesObraFinaUseCase: ListarAsignacionesObraFinaUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu10-asignacion-tareas-obra-fina',
      status: 'ok' as const,
    };
  }

  async asignar(dto: AsignarTareaObraFinaDto) {
    return this.asignarTareaObraFinaUseCase.execute(dto);
  }

  async modificar(dto: ModificarAsignacionObraFinaDto) {
    return this.modificarAsignacionObraFinaUseCase.execute(dto);
  }

  async cancelar(dto: CancelarAsignacionObraFinaDto) {
    return this.cancelarAsignacionObraFinaUseCase.execute(dto);
  }

  async consultar(dto: ConsultarAsignacionObraFinaDto) {
    return this.consultarAsignacionObraFinaUseCase.execute(dto);
  }

  async listar(dto: ListarAsignacionesObraFinaDto) {
    return this.listarAsignacionesObraFinaUseCase.execute(dto);
  }
}
