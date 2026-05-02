import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule, RepositoriesModule } from './infrastructure';
import { Cu01Module } from './use-cases/cu01-gestionar-clientes/cu01.module';
import { Cu02Module } from './use-cases/cu02-creacion-proyectos/cu02.module';
import { Cu03Module } from './use-cases/cu03-gestion-tareas-obra-fina/cu03.module';
import { Cu04Module } from './use-cases/cu04-gestion-tareas-obra-bruta/cu04.module';
import { Cu05Module } from './use-cases/cu05-creacion-cronograma/cu05.module';
import { Cu06Module } from './use-cases/cu06-gestion-seguimiento/cu06.module';
import { Cu07Module } from './use-cases/cu07-gestion-contrato-contratista/cu07.module';
import { Cu08Module } from './use-cases/cu08-gestion-trabajador/cu08.module';
import { Cu09Module } from './use-cases/cu09-asignacion-tareas-obra-bruta/cu09.module';
import { Cu10Module } from './use-cases/cu10-asignacion-tareas-obra-fina/cu10.module';
import { Cu11Module } from './use-cases/cu11-asignacion-tareas-contratista/cu11.module';
import { Cu12Module } from './use-cases/cu12-registro-materiales/cu12.module';
import { Cu13Module } from './use-cases/cu13-gestion-proveedores/cu13.module';
import { Cu14Module } from './use-cases/cu14-gestion-ordenes-compra/cu14.module';
import { Cu15Module } from './use-cases/cu15-entrega-materiales/cu15.module';
import { Cu16Module } from './use-cases/cu16-asignacion-materiales-ia/cu16.module';
import { Cu17Module } from './use-cases/cu17-pronostico-materiales-ia/cu17.module';
import { Cu18Module } from './use-cases/cu18-alertas-notificaciones/cu18.module';
import { Cu19Module } from './use-cases/cu19-generar-reportes/cu19.module';

@Module({
  imports: [
    PrismaModule,
    RepositoriesModule,
    Cu01Module,
    Cu02Module,
    Cu03Module,
    Cu04Module,
    Cu05Module,
    Cu06Module,
    Cu07Module,
    Cu08Module,
    Cu09Module,
    Cu10Module,
    Cu11Module,
    Cu12Module,
    Cu13Module,
    Cu14Module,
    Cu15Module,
    Cu16Module,
    Cu17Module,
    Cu18Module,
    Cu19Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
