import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('SuArq API')
    .setDescription(
      'API REST del Sistema de Gestión de Proyectos de Construcción SuArq.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token JWT obtenido desde /auth/login.',
      },
      'access-token',
    )
    .addTag(
      'Auth',
      'Autenticación base con JWT y RBAC inicial. La granularidad fina por acción puede evolucionar en fases posteriores.',
    )
    .addTag('CU01 - Clientes')
    .addTag('CU02 - Proyectos')
    .addTag('CU03 - Tareas Obra Fina')
    .addTag('CU04 - Tareas Obra Bruta')
    .addTag('CU05 - Cronogramas')
    .addTag('CU06 - Seguimientos')
    .addTag('CU07 - Contratos Contratistas')
    .addTag('CU08 - Trabajadores')
    .addTag('CU09 - Asignaciones Obra Bruta')
    .addTag('CU10 - Asignaciones Obra Fina')
    .addTag('CU11 - Asignaciones Contratista')
    .addTag('CU12 - Materiales')
    .addTag('CU13 - Proveedores')
    .addTag('CU14 - Órdenes de Compra')
    .addTag('CU15 - Entregas de Materiales')
    .addTag(
      'CU16 - Asignación Materiales IA',
      'La IA actual usa una heurística interna provisional y todavía no integra servicios externos reales.',
    )
    .addTag(
      'CU17 - Pronóstico Materiales IA',
      'El pronóstico actual usa una heurística interna provisional y todavía no integra servicios externos reales.',
    )
    .addTag('CU18 - Alertas y Notificaciones')
    .addTag('CU19 - Reportes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
