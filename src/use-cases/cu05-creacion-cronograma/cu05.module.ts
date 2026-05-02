import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure';
import { CreacionCronogramaController } from './creacion-cronograma.controller';
import { CreacionCronogramaService } from './creacion-cronograma.service';
import {
  CrearCronogramaUseCase,
  ReplanificarCronogramaUseCase,
  ConsultarCronogramaUseCase,
  ListarCronogramasUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule],
  controllers: [CreacionCronogramaController],
  providers: [
    CreacionCronogramaService,
    CrearCronogramaUseCase,
    ReplanificarCronogramaUseCase,
    ConsultarCronogramaUseCase,
    ListarCronogramasUseCase,
  ],
})
export class Cu05Module {}
