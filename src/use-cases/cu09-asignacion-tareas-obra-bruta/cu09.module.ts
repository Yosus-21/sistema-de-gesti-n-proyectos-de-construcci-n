import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { TrabajadorDisponibilidadService } from '../shared';
import { AsignacionTareasObraBrutaController } from './asignacion-tareas-obra-bruta.controller';
import { AsignacionTareasObraBrutaService } from './asignacion-tareas-obra-bruta.service';
import {
  AsignarTareaObraBrutaUseCase,
  ModificarAsignacionObraBrutaUseCase,
  CancelarAsignacionObraBrutaUseCase,
  ConsultarAsignacionObraBrutaUseCase,
  ListarAsignacionesObraBrutaUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [AsignacionTareasObraBrutaController],
  providers: [
    AsignacionTareasObraBrutaService,
    AsignarTareaObraBrutaUseCase,
    ModificarAsignacionObraBrutaUseCase,
    CancelarAsignacionObraBrutaUseCase,
    ConsultarAsignacionObraBrutaUseCase,
    ListarAsignacionesObraBrutaUseCase,
    TrabajadorDisponibilidadService,
  ],
})
export class Cu09Module {}
