import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { CreacionProyectosController } from './creacion-proyectos.controller';
import { CreacionProyectosService } from './creacion-proyectos.service';
import {
  CrearProyectoUseCase,
  ConsultarProyectoUseCase,
  ListarProyectosUseCase,
  CambiarEstadoProyectoUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [CreacionProyectosController],
  providers: [
    CreacionProyectosService,
    CrearProyectoUseCase,
    ConsultarProyectoUseCase,
    ListarProyectosUseCase,
    CambiarEstadoProyectoUseCase,
  ],
})
export class Cu02Module {}
