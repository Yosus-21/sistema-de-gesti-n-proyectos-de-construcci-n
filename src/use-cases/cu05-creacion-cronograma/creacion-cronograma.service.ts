import { Injectable } from '@nestjs/common';
import {
  ConsultarCronogramaDto,
  CrearCronogramaDto,
  ListarCronogramasDto,
  ReplanificarCronogramaDto,
} from './dto';
import {
  ConsultarCronogramaUseCase,
  CrearCronogramaUseCase,
  ListarCronogramasUseCase,
  ReplanificarCronogramaUseCase,
} from './handlers';

@Injectable()
export class CreacionCronogramaService {
  constructor(
    private readonly crearCronogramaUseCase: CrearCronogramaUseCase,
    private readonly replanificarCronogramaUseCase: ReplanificarCronogramaUseCase,
    private readonly consultarCronogramaUseCase: ConsultarCronogramaUseCase,
    private readonly listarCronogramasUseCase: ListarCronogramasUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu05-creacion-cronograma',
      status: 'ok' as const,
    };
  }

  async crear(dto: CrearCronogramaDto) {
    return this.crearCronogramaUseCase.execute(dto);
  }

  async replanificar(dto: ReplanificarCronogramaDto) {
    return this.replanificarCronogramaUseCase.execute(dto);
  }

  async consultar(dto: ConsultarCronogramaDto) {
    return this.consultarCronogramaUseCase.execute(dto);
  }

  async listar(dto: ListarCronogramasDto) {
    return this.listarCronogramasUseCase.execute(dto);
  }
}
