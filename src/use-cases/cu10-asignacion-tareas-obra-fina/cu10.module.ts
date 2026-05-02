import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { AsignacionTareasObraFinaController } from './asignacion-tareas-obra-fina.controller';
import { AsignacionTareasObraFinaService } from './asignacion-tareas-obra-fina.service';
import {
  AsignarTareaObraFinaUseCase,
  ModificarAsignacionObraFinaUseCase,
  CancelarAsignacionObraFinaUseCase,
  ConsultarAsignacionObraFinaUseCase,
  ListarAsignacionesObraFinaUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [AsignacionTareasObraFinaController],
  providers: [
    AsignacionTareasObraFinaService,
    AsignarTareaObraFinaUseCase,
    ModificarAsignacionObraFinaUseCase,
    CancelarAsignacionObraFinaUseCase,
    ConsultarAsignacionObraFinaUseCase,
    ListarAsignacionesObraFinaUseCase,
  ],
})
export class Cu10Module {}
