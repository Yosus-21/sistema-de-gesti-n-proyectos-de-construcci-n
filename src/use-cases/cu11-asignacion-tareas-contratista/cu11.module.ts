import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { TrabajadorDisponibilidadService } from '../shared';
import { AsignacionTareasContratistaController } from './asignacion-tareas-contratista.controller';
import { AsignacionTareasContratistaService } from './asignacion-tareas-contratista.service';
import {
  AsignarTareaContratistaUseCase,
  ReasignarTrabajadorContratistaUseCase,
  CancelarAsignacionContratistaUseCase,
  ConsultarAsignacionContratistaUseCase,
  ListarAsignacionesContratistaUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [AsignacionTareasContratistaController],
  providers: [
    AsignacionTareasContratistaService,
    AsignarTareaContratistaUseCase,
    ReasignarTrabajadorContratistaUseCase,
    CancelarAsignacionContratistaUseCase,
    ConsultarAsignacionContratistaUseCase,
    ListarAsignacionesContratistaUseCase,
    TrabajadorDisponibilidadService,
  ],
})
export class Cu11Module {}
