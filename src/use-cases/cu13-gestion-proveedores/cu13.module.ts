import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { GestionProveedoresController } from './gestion-proveedores.controller';
import { GestionProveedoresService } from './gestion-proveedores.service';
import {
  RegistrarProveedorUseCase,
  ModificarProveedorUseCase,
  EliminarProveedorUseCase,
  ConsultarProveedorUseCase,
  ListarProveedoresUseCase,
  ValidarProveedorUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [GestionProveedoresController],
  providers: [
    GestionProveedoresService,
    RegistrarProveedorUseCase,
    ModificarProveedorUseCase,
    EliminarProveedorUseCase,
    ConsultarProveedorUseCase,
    ListarProveedoresUseCase,
    ValidarProveedorUseCase,
  ],
})
export class Cu13Module {}
