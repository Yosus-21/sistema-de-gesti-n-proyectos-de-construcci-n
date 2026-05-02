import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { GestionarClientesController } from './gestionar-clientes.controller';
import { GestionarClientesService } from './gestionar-clientes.service';
import {
  RegistrarClienteUseCase,
  ModificarClienteUseCase,
  EliminarClienteUseCase,
  ConsultarClienteUseCase,
  ListarClientesUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [GestionarClientesController],
  providers: [
    GestionarClientesService,
    RegistrarClienteUseCase,
    ModificarClienteUseCase,
    EliminarClienteUseCase,
    ConsultarClienteUseCase,
    ListarClientesUseCase,
  ],
})
export class Cu01Module {}
