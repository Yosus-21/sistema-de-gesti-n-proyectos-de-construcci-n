import { Injectable } from '@nestjs/common';
import {
  AjustarPronosticoMaterialDto,
  CalcularNivelConfianzaPronosticoDto,
  ConfirmarPronosticoMaterialDto,
  GenerarPronosticoMaterialDto,
  ListarPronosticosMaterialDto,
} from './dto';
import {
  AjustarPronosticoMaterialUseCase,
  CalcularNivelConfianzaPronosticoUseCase,
  ConfirmarPronosticoMaterialUseCase,
  GenerarPronosticoMaterialUseCase,
  ListarPronosticosMaterialUseCase,
} from './handlers';

@Injectable()
export class PronosticoMaterialesIaService {
  constructor(
    private readonly generarPronosticoMaterialUseCase: GenerarPronosticoMaterialUseCase,
    private readonly ajustarPronosticoMaterialUseCase: AjustarPronosticoMaterialUseCase,
    private readonly confirmarPronosticoMaterialUseCase: ConfirmarPronosticoMaterialUseCase,
    private readonly calcularNivelConfianzaPronosticoUseCase: CalcularNivelConfianzaPronosticoUseCase,
    private readonly listarPronosticosMaterialUseCase: ListarPronosticosMaterialUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu17-pronostico-materiales-ia',
      status: 'ok' as const,
    };
  }

  generar(dto: GenerarPronosticoMaterialDto) {
    return this.generarPronosticoMaterialUseCase.execute(dto);
  }

  ajustar(dto: AjustarPronosticoMaterialDto) {
    return this.ajustarPronosticoMaterialUseCase.execute(dto);
  }

  confirmar(dto: ConfirmarPronosticoMaterialDto) {
    return this.confirmarPronosticoMaterialUseCase.execute(dto);
  }

  calcularNivelConfianza(dto: CalcularNivelConfianzaPronosticoDto) {
    return this.calcularNivelConfianzaPronosticoUseCase.execute(dto);
  }

  listar(dto: ListarPronosticosMaterialDto) {
    return this.listarPronosticosMaterialUseCase.execute(dto);
  }
}
