import { Injectable } from '@nestjs/common';
import {
  CalcularDesviacionDto,
  ConsultarSeguimientoDto,
  ListarSeguimientosDto,
  ModificarSeguimientoDto,
  RegistrarSeguimientoDto,
} from './dto';
import {
  CalcularDesviacionUseCase,
  ConsultarSeguimientoUseCase,
  ListarSeguimientosUseCase,
  ModificarSeguimientoUseCase,
  RegistrarSeguimientoUseCase,
} from './handlers';

@Injectable()
export class GestionSeguimientoService {
  constructor(
    private readonly registrarSeguimientoUseCase: RegistrarSeguimientoUseCase,
    private readonly modificarSeguimientoUseCase: ModificarSeguimientoUseCase,
    private readonly consultarSeguimientoUseCase: ConsultarSeguimientoUseCase,
    private readonly listarSeguimientosUseCase: ListarSeguimientosUseCase,
    private readonly calcularDesviacionUseCase: CalcularDesviacionUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu06-gestion-seguimiento',
      status: 'ok' as const,
    };
  }

  async registrar(dto: RegistrarSeguimientoDto) {
    return this.registrarSeguimientoUseCase.execute(dto);
  }

  async modificar(dto: ModificarSeguimientoDto) {
    return this.modificarSeguimientoUseCase.execute(dto);
  }

  async consultar(dto: ConsultarSeguimientoDto) {
    return this.consultarSeguimientoUseCase.execute(dto);
  }

  async listar(dto: ListarSeguimientosDto) {
    return this.listarSeguimientosUseCase.execute(dto);
  }

  async calcularDesviacion(dto: CalcularDesviacionDto) {
    return this.calcularDesviacionUseCase.execute(dto);
  }
}
