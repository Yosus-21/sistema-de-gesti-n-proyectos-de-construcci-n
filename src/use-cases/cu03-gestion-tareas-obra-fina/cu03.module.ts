import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { GestionTareasObraFinaController } from './gestion-tareas-obra-fina.controller';
import { GestionTareasObraFinaService } from './gestion-tareas-obra-fina.service';
import {
  RegistrarTareaObraFinaUseCase,
  ModificarTareaObraFinaUseCase,
  EliminarTareaObraFinaUseCase,
  ListarTareasObraFinaUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [GestionTareasObraFinaController],
  providers: [
    GestionTareasObraFinaService,
    RegistrarTareaObraFinaUseCase,
    ModificarTareaObraFinaUseCase,
    EliminarTareaObraFinaUseCase,
    ListarTareasObraFinaUseCase,
  ],
})
export class Cu03Module {}
