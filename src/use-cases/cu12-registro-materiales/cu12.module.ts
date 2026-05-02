import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { RegistroMaterialesController } from './registro-materiales.controller';
import { RegistroMaterialesService } from './registro-materiales.service';
import {
  RegistrarMaterialUseCase,
  ModificarMaterialUseCase,
  EliminarMaterialUseCase,
  ConsultarMaterialUseCase,
  ListarMaterialesUseCase,
  ActualizarStockMaterialUseCase,
  VerificarDisponibilidadMaterialUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [RegistroMaterialesController],
  providers: [
    RegistroMaterialesService,
    RegistrarMaterialUseCase,
    ModificarMaterialUseCase,
    EliminarMaterialUseCase,
    ConsultarMaterialUseCase,
    ListarMaterialesUseCase,
    ActualizarStockMaterialUseCase,
    VerificarDisponibilidadMaterialUseCase,
  ],
})
export class Cu12Module {}
