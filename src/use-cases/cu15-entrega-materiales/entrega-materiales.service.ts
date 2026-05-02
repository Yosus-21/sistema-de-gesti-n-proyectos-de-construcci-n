import { Injectable } from '@nestjs/common';
import {
  ConfirmarRecepcionMaterialDto,
  ConsultarEntregaMaterialDto,
  ListarEntregasMaterialDto,
  RegistrarEntregaMaterialDto,
  VerificarEntregaContraOrdenDto,
} from './dto';
import {
  ConfirmarRecepcionMaterialUseCase,
  ConsultarEntregaMaterialUseCase,
  ListarEntregasMaterialUseCase,
  RegistrarEntregaMaterialUseCase,
  VerificarEntregaContraOrdenUseCase,
} from './handlers';

@Injectable()
export class EntregaMaterialesService {
  constructor(
    private readonly registrarEntregaMaterialUseCase: RegistrarEntregaMaterialUseCase,
    private readonly confirmarRecepcionMaterialUseCase: ConfirmarRecepcionMaterialUseCase,
    private readonly consultarEntregaMaterialUseCase: ConsultarEntregaMaterialUseCase,
    private readonly listarEntregasMaterialUseCase: ListarEntregasMaterialUseCase,
    private readonly verificarEntregaContraOrdenUseCase: VerificarEntregaContraOrdenUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu15-entrega-materiales',
      status: 'ok' as const,
    };
  }

  registrar(dto: RegistrarEntregaMaterialDto) {
    return this.registrarEntregaMaterialUseCase.execute(dto);
  }

  confirmarRecepcion(dto: ConfirmarRecepcionMaterialDto) {
    return this.confirmarRecepcionMaterialUseCase.execute(dto);
  }

  consultar(dto: ConsultarEntregaMaterialDto) {
    return this.consultarEntregaMaterialUseCase.execute(dto);
  }

  listar(dto: ListarEntregasMaterialDto) {
    return this.listarEntregasMaterialUseCase.execute(dto);
  }

  verificarContraOrden(dto: VerificarEntregaContraOrdenDto) {
    return this.verificarEntregaContraOrdenUseCase.execute(dto);
  }
}
