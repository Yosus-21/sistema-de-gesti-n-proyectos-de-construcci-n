import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { GestionOrdenesCompraController } from './gestion-ordenes-compra.controller';
import { GestionOrdenesCompraService } from './gestion-ordenes-compra.service';
import {
  CrearOrdenCompraUseCase,
  AgregarLineaOrdenCompraUseCase,
  ModificarOrdenCompraUseCase,
  ConsultarOrdenCompraUseCase,
  ListarOrdenesCompraUseCase,
  ActualizarEstadoOrdenCompraUseCase,
  CalcularMontoTotalOrdenCompraUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [GestionOrdenesCompraController],
  providers: [
    GestionOrdenesCompraService,
    CrearOrdenCompraUseCase,
    AgregarLineaOrdenCompraUseCase,
    ModificarOrdenCompraUseCase,
    ConsultarOrdenCompraUseCase,
    ListarOrdenesCompraUseCase,
    ActualizarEstadoOrdenCompraUseCase,
    CalcularMontoTotalOrdenCompraUseCase,
  ],
})
export class Cu14Module {}
