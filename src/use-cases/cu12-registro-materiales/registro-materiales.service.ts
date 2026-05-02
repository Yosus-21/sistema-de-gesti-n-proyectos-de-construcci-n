import { Injectable } from '@nestjs/common';
import {
  ActualizarStockMaterialDto,
  ConsultarMaterialDto,
  EliminarMaterialDto,
  ListarMaterialesDto,
  ModificarMaterialDto,
  RegistrarMaterialDto,
  VerificarDisponibilidadMaterialDto,
} from './dto';
import {
  ActualizarStockMaterialUseCase,
  ConsultarMaterialUseCase,
  EliminarMaterialUseCase,
  ListarMaterialesUseCase,
  ModificarMaterialUseCase,
  RegistrarMaterialUseCase,
  VerificarDisponibilidadMaterialUseCase,
} from './handlers';

@Injectable()
export class RegistroMaterialesService {
  constructor(
    private readonly registrarMaterialUseCase: RegistrarMaterialUseCase,
    private readonly modificarMaterialUseCase: ModificarMaterialUseCase,
    private readonly eliminarMaterialUseCase: EliminarMaterialUseCase,
    private readonly consultarMaterialUseCase: ConsultarMaterialUseCase,
    private readonly listarMaterialesUseCase: ListarMaterialesUseCase,
    private readonly actualizarStockMaterialUseCase: ActualizarStockMaterialUseCase,
    private readonly verificarDisponibilidadMaterialUseCase: VerificarDisponibilidadMaterialUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu12-registro-materiales',
      status: 'ok' as const,
    };
  }

  async registrar(dto: RegistrarMaterialDto) {
    return this.registrarMaterialUseCase.execute(dto);
  }

  async modificar(dto: ModificarMaterialDto) {
    return this.modificarMaterialUseCase.execute(dto);
  }

  async eliminar(dto: EliminarMaterialDto) {
    return this.eliminarMaterialUseCase.execute(dto);
  }

  async consultar(dto: ConsultarMaterialDto) {
    return this.consultarMaterialUseCase.execute(dto);
  }

  async listar(dto: ListarMaterialesDto) {
    return this.listarMaterialesUseCase.execute(dto);
  }

  async actualizarStock(dto: ActualizarStockMaterialDto) {
    return this.actualizarStockMaterialUseCase.execute(dto);
  }

  async verificarDisponibilidad(dto: VerificarDisponibilidadMaterialDto) {
    return this.verificarDisponibilidadMaterialUseCase.execute(dto);
  }
}
