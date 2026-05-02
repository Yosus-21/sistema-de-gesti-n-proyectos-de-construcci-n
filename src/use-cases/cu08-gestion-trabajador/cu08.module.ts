import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { GestionTrabajadorController } from './gestion-trabajador.controller';
import { GestionTrabajadorService } from './gestion-trabajador.service';
import {
  RegistrarTrabajadorUseCase,
  ModificarTrabajadorUseCase,
  EliminarTrabajadorUseCase,
  ConsultarTrabajadorUseCase,
  ListarTrabajadoresUseCase,
  VerificarDisponibilidadTrabajadorUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [GestionTrabajadorController],
  providers: [
    GestionTrabajadorService,
    RegistrarTrabajadorUseCase,
    ModificarTrabajadorUseCase,
    EliminarTrabajadorUseCase,
    ConsultarTrabajadorUseCase,
    ListarTrabajadoresUseCase,
    VerificarDisponibilidadTrabajadorUseCase,
  ],
})
export class Cu08Module {}
