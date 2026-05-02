import { Injectable } from '@nestjs/common';
import {
  ActualizarEstadoOrdenCompraDto,
  AgregarLineaOrdenCompraDto,
  CalcularMontoTotalOrdenCompraDto,
  ConsultarOrdenCompraDto,
  CrearOrdenCompraDto,
  ListarOrdenesCompraDto,
  ModificarOrdenCompraDto,
} from './dto';
import {
  ActualizarEstadoOrdenCompraUseCase,
  AgregarLineaOrdenCompraUseCase,
  CalcularMontoTotalOrdenCompraUseCase,
  ConsultarOrdenCompraUseCase,
  CrearOrdenCompraUseCase,
  ListarOrdenesCompraUseCase,
  ModificarOrdenCompraUseCase,
} from './handlers';

@Injectable()
export class GestionOrdenesCompraService {
  constructor(
    private readonly crearOrdenCompraUseCase: CrearOrdenCompraUseCase,
    private readonly agregarLineaOrdenCompraUseCase: AgregarLineaOrdenCompraUseCase,
    private readonly modificarOrdenCompraUseCase: ModificarOrdenCompraUseCase,
    private readonly consultarOrdenCompraUseCase: ConsultarOrdenCompraUseCase,
    private readonly listarOrdenesCompraUseCase: ListarOrdenesCompraUseCase,
    private readonly actualizarEstadoOrdenCompraUseCase: ActualizarEstadoOrdenCompraUseCase,
    private readonly calcularMontoTotalOrdenCompraUseCase: CalcularMontoTotalOrdenCompraUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu14-gestion-ordenes-compra',
      status: 'ok' as const,
    };
  }

  crear(dto: CrearOrdenCompraDto) {
    return this.crearOrdenCompraUseCase.execute(dto);
  }

  agregarLinea(dto: AgregarLineaOrdenCompraDto) {
    return this.agregarLineaOrdenCompraUseCase.execute(dto);
  }

  modificar(dto: ModificarOrdenCompraDto) {
    return this.modificarOrdenCompraUseCase.execute(dto);
  }

  consultar(dto: ConsultarOrdenCompraDto) {
    return this.consultarOrdenCompraUseCase.execute(dto);
  }

  listar(dto: ListarOrdenesCompraDto) {
    return this.listarOrdenesCompraUseCase.execute(dto);
  }

  actualizarEstado(dto: ActualizarEstadoOrdenCompraDto) {
    return this.actualizarEstadoOrdenCompraUseCase.execute(dto);
  }

  calcularMontoTotal(dto: CalcularMontoTotalOrdenCompraDto) {
    return this.calcularMontoTotalOrdenCompraUseCase.execute(dto);
  }
}
