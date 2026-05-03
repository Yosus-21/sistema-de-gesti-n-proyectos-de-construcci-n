import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import {
  PrismaClienteRepository,
  PrismaProyectoRepository,
  PrismaCronogramaRepository,
  PrismaTareaRepository,
  PrismaSeguimientoRepository,
  PrismaContratoRepository,
  PrismaContratistaRepository,
  PrismaTrabajadorRepository,
  PrismaMaterialRepository,
  PrismaProveedorRepository,
  PrismaOrdenCompraRepository,
  PrismaEntregaMaterialRepository,
  PrismaAsignacionTareaRepository,
  PrismaAsignacionMaterialRepository,
  PrismaPronosticoMaterialRepository,
  PrismaAlertaRepository,
  PrismaReporteRepository,
  PrismaUsuarioRepository,
} from './prisma';
import {
  ALERTA_REPOSITORY,
  ASIGNACION_MATERIAL_REPOSITORY,
  ASIGNACION_TAREA_REPOSITORY,
  CLIENTE_REPOSITORY,
  CONTRATISTA_REPOSITORY,
  CONTRATO_REPOSITORY,
  CRONOGRAMA_REPOSITORY,
  ENTREGA_MATERIAL_REPOSITORY,
  MATERIAL_REPOSITORY,
  ORDEN_COMPRA_REPOSITORY,
  PRONOSTICO_MATERIAL_REPOSITORY,
  PROVEEDOR_REPOSITORY,
  PROYECTO_REPOSITORY,
  REPORTE_REPOSITORY,
  SEGUIMIENTO_REPOSITORY,
  TAREA_REPOSITORY,
  TRABAJADOR_REPOSITORY,
  USUARIO_REPOSITORY,
} from './repository.tokens';

const repositoryProviders: Provider[] = [
  {
    provide: CLIENTE_REPOSITORY,
    useClass: PrismaClienteRepository,
  },
  {
    provide: PROYECTO_REPOSITORY,
    useClass: PrismaProyectoRepository,
  },
  {
    provide: CRONOGRAMA_REPOSITORY,
    useClass: PrismaCronogramaRepository,
  },
  {
    provide: TAREA_REPOSITORY,
    useClass: PrismaTareaRepository,
  },
  {
    provide: SEGUIMIENTO_REPOSITORY,
    useClass: PrismaSeguimientoRepository,
  },
  {
    provide: CONTRATO_REPOSITORY,
    useClass: PrismaContratoRepository,
  },
  {
    provide: CONTRATISTA_REPOSITORY,
    useClass: PrismaContratistaRepository,
  },
  {
    provide: TRABAJADOR_REPOSITORY,
    useClass: PrismaTrabajadorRepository,
  },
  {
    provide: MATERIAL_REPOSITORY,
    useClass: PrismaMaterialRepository,
  },
  {
    provide: PROVEEDOR_REPOSITORY,
    useClass: PrismaProveedorRepository,
  },
  {
    provide: ORDEN_COMPRA_REPOSITORY,
    useClass: PrismaOrdenCompraRepository,
  },
  {
    provide: ENTREGA_MATERIAL_REPOSITORY,
    useClass: PrismaEntregaMaterialRepository,
  },
  {
    provide: ASIGNACION_TAREA_REPOSITORY,
    useClass: PrismaAsignacionTareaRepository,
  },
  {
    provide: ASIGNACION_MATERIAL_REPOSITORY,
    useClass: PrismaAsignacionMaterialRepository,
  },
  {
    provide: PRONOSTICO_MATERIAL_REPOSITORY,
    useClass: PrismaPronosticoMaterialRepository,
  },
  {
    provide: ALERTA_REPOSITORY,
    useClass: PrismaAlertaRepository,
  },
  {
    provide: REPORTE_REPOSITORY,
    useClass: PrismaReporteRepository,
  },
  {
    provide: USUARIO_REPOSITORY,
    useClass: PrismaUsuarioRepository,
  },
];

const repositoryExports = [
  CLIENTE_REPOSITORY,
  PROYECTO_REPOSITORY,
  CRONOGRAMA_REPOSITORY,
  TAREA_REPOSITORY,
  SEGUIMIENTO_REPOSITORY,
  CONTRATO_REPOSITORY,
  CONTRATISTA_REPOSITORY,
  TRABAJADOR_REPOSITORY,
  MATERIAL_REPOSITORY,
  PROVEEDOR_REPOSITORY,
  ORDEN_COMPRA_REPOSITORY,
  ENTREGA_MATERIAL_REPOSITORY,
  ASIGNACION_TAREA_REPOSITORY,
  ASIGNACION_MATERIAL_REPOSITORY,
  PRONOSTICO_MATERIAL_REPOSITORY,
  ALERTA_REPOSITORY,
  REPORTE_REPOSITORY,
  USUARIO_REPOSITORY,
];

@Module({
  imports: [PrismaModule],
  providers: repositoryProviders,
  exports: repositoryExports,
})
export class RepositoriesModule {}
