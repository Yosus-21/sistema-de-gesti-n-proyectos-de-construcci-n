import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { GestionContratoContratistaController } from './gestion-contrato-contratista.controller';
import { GestionContratoContratistaService } from './gestion-contrato-contratista.service';
import {
  RegistrarContratoContratistaUseCase,
  ModificarContratoContratistaUseCase,
  ConsultarContratoContratistaUseCase,
  ListarContratosContratistaUseCase,
  CalcularCostoContratoUseCase,
  ValidarVigenciaContratoUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [GestionContratoContratistaController],
  providers: [
    GestionContratoContratistaService,
    RegistrarContratoContratistaUseCase,
    ModificarContratoContratistaUseCase,
    ConsultarContratoContratistaUseCase,
    ListarContratosContratistaUseCase,
    CalcularCostoContratoUseCase,
    ValidarVigenciaContratoUseCase,
  ],
})
export class Cu07Module {}
