import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { EntregaMaterialesController } from './entrega-materiales.controller';
import { EntregaMaterialesService } from './entrega-materiales.service';
import {
  RegistrarEntregaMaterialUseCase,
  ConfirmarRecepcionMaterialUseCase,
  ConsultarEntregaMaterialUseCase,
  ListarEntregasMaterialUseCase,
  VerificarEntregaContraOrdenUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [EntregaMaterialesController],
  providers: [
    EntregaMaterialesService,
    RegistrarEntregaMaterialUseCase,
    ConfirmarRecepcionMaterialUseCase,
    ConsultarEntregaMaterialUseCase,
    ListarEntregasMaterialUseCase,
    VerificarEntregaContraOrdenUseCase,
  ],
})
export class Cu15Module {}
