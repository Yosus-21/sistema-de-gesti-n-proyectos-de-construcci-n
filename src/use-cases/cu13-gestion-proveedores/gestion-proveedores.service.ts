import { Injectable } from '@nestjs/common';
import {
  ConsultarProveedorDto,
  EliminarProveedorDto,
  ListarProveedoresDto,
  ModificarProveedorDto,
  RegistrarProveedorDto,
  ValidarProveedorDto,
} from './dto';
import {
  ConsultarProveedorUseCase,
  EliminarProveedorUseCase,
  ListarProveedoresUseCase,
  ModificarProveedorUseCase,
  RegistrarProveedorUseCase,
  ValidarProveedorUseCase,
} from './handlers';

@Injectable()
export class GestionProveedoresService {
  constructor(
    private readonly registrarProveedorUseCase: RegistrarProveedorUseCase,
    private readonly modificarProveedorUseCase: ModificarProveedorUseCase,
    private readonly eliminarProveedorUseCase: EliminarProveedorUseCase,
    private readonly consultarProveedorUseCase: ConsultarProveedorUseCase,
    private readonly listarProveedoresUseCase: ListarProveedoresUseCase,
    private readonly validarProveedorUseCase: ValidarProveedorUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu13-gestion-proveedores',
      status: 'ok' as const,
    };
  }

  registrar(dto: RegistrarProveedorDto) {
    return this.registrarProveedorUseCase.execute(dto);
  }

  modificar(dto: ModificarProveedorDto) {
    return this.modificarProveedorUseCase.execute(dto);
  }

  eliminar(dto: EliminarProveedorDto) {
    return this.eliminarProveedorUseCase.execute(dto);
  }

  consultar(dto: ConsultarProveedorDto) {
    return this.consultarProveedorUseCase.execute(dto);
  }

  listar(dto: ListarProveedoresDto) {
    return this.listarProveedoresUseCase.execute(dto);
  }

  validar(dto: ValidarProveedorDto) {
    return this.validarProveedorUseCase.execute(dto);
  }
}
