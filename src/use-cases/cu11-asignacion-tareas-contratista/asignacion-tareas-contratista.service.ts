import { Injectable } from '@nestjs/common';
import {
  AsignarTareaContratistaDto,
  CancelarAsignacionContratistaDto,
  ConsultarAsignacionContratistaDto,
  ListarAsignacionesContratistaDto,
  ReasignarTrabajadorContratistaDto,
} from './dto';
import {
  AsignarTareaContratistaUseCase,
  CancelarAsignacionContratistaUseCase,
  ConsultarAsignacionContratistaUseCase,
  ListarAsignacionesContratistaUseCase,
  ReasignarTrabajadorContratistaUseCase,
} from './handlers';

@Injectable()
export class AsignacionTareasContratistaService {
  constructor(
    private readonly asignarTareaContratistaUseCase: AsignarTareaContratistaUseCase,
    private readonly reasignarTrabajadorContratistaUseCase: ReasignarTrabajadorContratistaUseCase,
    private readonly cancelarAsignacionContratistaUseCase: CancelarAsignacionContratistaUseCase,
    private readonly consultarAsignacionContratistaUseCase: ConsultarAsignacionContratistaUseCase,
    private readonly listarAsignacionesContratistaUseCase: ListarAsignacionesContratistaUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu11-asignacion-tareas-contratista',
      status: 'ok' as const,
    };
  }

  async asignar(dto: AsignarTareaContratistaDto) {
    return this.asignarTareaContratistaUseCase.execute(dto);
  }

  async reasignar(dto: ReasignarTrabajadorContratistaDto) {
    return this.reasignarTrabajadorContratistaUseCase.execute(dto);
  }

  async cancelar(dto: CancelarAsignacionContratistaDto) {
    return this.cancelarAsignacionContratistaUseCase.execute(dto);
  }

  async consultar(dto: ConsultarAsignacionContratistaDto) {
    return this.consultarAsignacionContratistaUseCase.execute(dto);
  }

  async listar(dto: ListarAsignacionesContratistaDto) {
    return this.listarAsignacionesContratistaUseCase.execute(dto);
  }
}
