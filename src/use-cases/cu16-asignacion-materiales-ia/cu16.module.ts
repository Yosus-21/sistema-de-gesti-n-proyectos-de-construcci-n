import { Module } from '@nestjs/common';
import { RepositoriesModule, AiModule } from '../../infrastructure';
import { AsignacionMaterialesIaController } from './asignacion-materiales-ia.controller';
import { AsignacionMaterialesIaService } from './asignacion-materiales-ia.service';
import {
  GenerarPropuestaAsignacionMaterialUseCase,
  ConfirmarAsignacionMaterialUseCase,
  AjustarAsignacionMaterialUseCase,
  ValidarRestriccionesAsignacionMaterialUseCase,
  ListarAsignacionesMaterialUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule, AiModule],
  controllers: [AsignacionMaterialesIaController],
  providers: [
    AsignacionMaterialesIaService,
    GenerarPropuestaAsignacionMaterialUseCase,
    ConfirmarAsignacionMaterialUseCase,
    AjustarAsignacionMaterialUseCase,
    ValidarRestriccionesAsignacionMaterialUseCase,
    ListarAsignacionesMaterialUseCase,
  ],
})
export class Cu16Module {}
