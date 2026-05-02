import { Injectable } from '@nestjs/common';
import {
  AsignarTareaObraBrutaDto,
  CancelarAsignacionObraBrutaDto,
  ConsultarAsignacionObraBrutaDto,
  ListarAsignacionesObraBrutaDto,
  ModificarAsignacionObraBrutaDto,
} from './dto';
import {
  AsignarTareaObraBrutaUseCase,
  CancelarAsignacionObraBrutaUseCase,
  ConsultarAsignacionObraBrutaUseCase,
  ListarAsignacionesObraBrutaUseCase,
  ModificarAsignacionObraBrutaUseCase,
} from './handlers';

@Injectable()
export class AsignacionTareasObraBrutaService {
  constructor(
    private readonly asignarTareaObraBrutaUseCase: AsignarTareaObraBrutaUseCase,
    private readonly modificarAsignacionObraBrutaUseCase: ModificarAsignacionObraBrutaUseCase,
    private readonly cancelarAsignacionObraBrutaUseCase: CancelarAsignacionObraBrutaUseCase,
    private readonly consultarAsignacionObraBrutaUseCase: ConsultarAsignacionObraBrutaUseCase,
    private readonly listarAsignacionesObraBrutaUseCase: ListarAsignacionesObraBrutaUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu09-asignacion-tareas-obra-bruta',
      status: 'ok' as const,
    };
  }

  async asignar(dto: AsignarTareaObraBrutaDto) {
    return this.asignarTareaObraBrutaUseCase.execute(dto);
  }

  async modificar(dto: ModificarAsignacionObraBrutaDto) {
    return this.modificarAsignacionObraBrutaUseCase.execute(dto);
  }

  async cancelar(dto: CancelarAsignacionObraBrutaDto) {
    return this.cancelarAsignacionObraBrutaUseCase.execute(dto);
  }

  async consultar(dto: ConsultarAsignacionObraBrutaDto) {
    return this.consultarAsignacionObraBrutaUseCase.execute(dto);
  }

  async listar(dto: ListarAsignacionesObraBrutaDto) {
    return this.listarAsignacionesObraBrutaUseCase.execute(dto);
  }
}
