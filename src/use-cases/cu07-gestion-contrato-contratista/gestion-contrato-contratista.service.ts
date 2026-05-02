import { Injectable } from '@nestjs/common';
import {
  CalcularCostoContratoDto,
  ConsultarContratoContratistaDto,
  ListarContratosContratistaDto,
  ModificarContratoContratistaDto,
  RegistrarContratoContratistaDto,
  ValidarVigenciaContratoDto,
} from './dto';
import {
  CalcularCostoContratoUseCase,
  ConsultarContratoContratistaUseCase,
  ListarContratosContratistaUseCase,
  ModificarContratoContratistaUseCase,
  RegistrarContratoContratistaUseCase,
  ValidarVigenciaContratoUseCase,
} from './handlers';

@Injectable()
export class GestionContratoContratistaService {
  constructor(
    private readonly registrarContratoContratistaUseCase: RegistrarContratoContratistaUseCase,
    private readonly modificarContratoContratistaUseCase: ModificarContratoContratistaUseCase,
    private readonly consultarContratoContratistaUseCase: ConsultarContratoContratistaUseCase,
    private readonly listarContratosContratistaUseCase: ListarContratosContratistaUseCase,
    private readonly calcularCostoContratoUseCase: CalcularCostoContratoUseCase,
    private readonly validarVigenciaContratoUseCase: ValidarVigenciaContratoUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu07-gestion-contrato-contratista',
      status: 'ok' as const,
    };
  }

  async registrar(dto: RegistrarContratoContratistaDto) {
    return this.registrarContratoContratistaUseCase.execute(dto);
  }

  async modificar(dto: ModificarContratoContratistaDto) {
    return this.modificarContratoContratistaUseCase.execute(dto);
  }

  async consultar(dto: ConsultarContratoContratistaDto) {
    return this.consultarContratoContratistaUseCase.execute(dto);
  }

  async listar(dto: ListarContratosContratistaDto) {
    return this.listarContratosContratistaUseCase.execute(dto);
  }

  async calcularCosto(dto: CalcularCostoContratoDto) {
    return this.calcularCostoContratoUseCase.execute(dto);
  }

  async validarVigencia(dto: ValidarVigenciaContratoDto) {
    return this.validarVigenciaContratoUseCase.execute(dto);
  }
}
