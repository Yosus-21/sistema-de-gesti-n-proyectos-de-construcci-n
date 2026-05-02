import { Injectable } from '@nestjs/common';
import {
  AjustarAsignacionMaterialDto,
  ConfirmarAsignacionMaterialDto,
  GenerarPropuestaAsignacionMaterialDto,
  ListarAsignacionesMaterialDto,
  ValidarRestriccionesAsignacionMaterialDto,
} from './dto';
import {
  AjustarAsignacionMaterialUseCase,
  ConfirmarAsignacionMaterialUseCase,
  GenerarPropuestaAsignacionMaterialUseCase,
  ListarAsignacionesMaterialUseCase,
  ValidarRestriccionesAsignacionMaterialUseCase,
} from './handlers';

@Injectable()
export class AsignacionMaterialesIaService {
  constructor(
    private readonly generarPropuestaAsignacionMaterialUseCase: GenerarPropuestaAsignacionMaterialUseCase,
    private readonly confirmarAsignacionMaterialUseCase: ConfirmarAsignacionMaterialUseCase,
    private readonly ajustarAsignacionMaterialUseCase: AjustarAsignacionMaterialUseCase,
    private readonly validarRestriccionesAsignacionMaterialUseCase: ValidarRestriccionesAsignacionMaterialUseCase,
    private readonly listarAsignacionesMaterialUseCase: ListarAsignacionesMaterialUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu16-asignacion-materiales-ia',
      status: 'ok' as const,
    };
  }

  generarPropuesta(dto: GenerarPropuestaAsignacionMaterialDto) {
    return this.generarPropuestaAsignacionMaterialUseCase.execute(dto);
  }

  confirmar(dto: ConfirmarAsignacionMaterialDto) {
    return this.confirmarAsignacionMaterialUseCase.execute(dto);
  }

  ajustar(dto: AjustarAsignacionMaterialDto) {
    return this.ajustarAsignacionMaterialUseCase.execute(dto);
  }

  validarRestricciones(dto: ValidarRestriccionesAsignacionMaterialDto) {
    return this.validarRestriccionesAsignacionMaterialUseCase.execute(dto);
  }

  listar(dto: ListarAsignacionesMaterialDto) {
    return this.listarAsignacionesMaterialUseCase.execute(dto);
  }
}
