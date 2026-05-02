import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { PronosticoMaterialesIaController } from './pronostico-materiales-ia.controller';
import { PronosticoMaterialesIaService } from './pronostico-materiales-ia.service';
import {
  GenerarPronosticoMaterialUseCase,
  AjustarPronosticoMaterialUseCase,
  ConfirmarPronosticoMaterialUseCase,
  CalcularNivelConfianzaPronosticoUseCase,
  ListarPronosticosMaterialUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [PronosticoMaterialesIaController],
  providers: [
    PronosticoMaterialesIaService,
    GenerarPronosticoMaterialUseCase,
    AjustarPronosticoMaterialUseCase,
    ConfirmarPronosticoMaterialUseCase,
    CalcularNivelConfianzaPronosticoUseCase,
    ListarPronosticosMaterialUseCase,
  ],
})
export class Cu17Module {}
