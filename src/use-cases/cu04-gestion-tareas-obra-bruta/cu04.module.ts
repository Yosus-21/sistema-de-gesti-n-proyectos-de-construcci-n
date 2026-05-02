import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { GestionTareasObraBrutaController } from './gestion-tareas-obra-bruta.controller';
import { GestionTareasObraBrutaService } from './gestion-tareas-obra-bruta.service';
import {
  RegistrarTareaObraBrutaUseCase,
  ModificarTareaObraBrutaUseCase,
  EliminarTareaObraBrutaUseCase,
  ListarTareasObraBrutaUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [GestionTareasObraBrutaController],
  providers: [
    GestionTareasObraBrutaService,
    RegistrarTareaObraBrutaUseCase,
    ModificarTareaObraBrutaUseCase,
    EliminarTareaObraBrutaUseCase,
    ListarTareasObraBrutaUseCase,
  ],
})
export class Cu04Module {}
