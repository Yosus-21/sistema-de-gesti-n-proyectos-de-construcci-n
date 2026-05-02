import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { GestionSeguimientoController } from './gestion-seguimiento.controller';
import { GestionSeguimientoService } from './gestion-seguimiento.service';
import {
  RegistrarSeguimientoUseCase,
  ModificarSeguimientoUseCase,
  ConsultarSeguimientoUseCase,
  ListarSeguimientosUseCase,
  CalcularDesviacionUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [GestionSeguimientoController],
  providers: [
    GestionSeguimientoService,
    RegistrarSeguimientoUseCase,
    ModificarSeguimientoUseCase,
    ConsultarSeguimientoUseCase,
    ListarSeguimientosUseCase,
    CalcularDesviacionUseCase,
  ],
})
export class Cu06Module {}
