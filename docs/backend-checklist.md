# Backend Delivery Checklist

## Entorno

- [ ] Node.js 22 disponible
- [ ] npm disponible
- [ ] Docker Compose operativo
- [ ] `.env` derivado de `.env.example` cuando aplique
- [ ] Variables de seguridad (`CORS_*`, `THROTTLE_*`) definidas para el entorno
- [ ] `NODE_ENV` definido como `development`, `test` o `production`
- [ ] `JWT_SECRET` fuerte y no versionado definido para producción
- [ ] `AUTH_REGISTER_ENABLED` definido según el entorno
- [ ] Variables de bootstrap admin (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) definidas solo cuando se ejecute el seed
- [ ] Variables de notificaciones email (`EMAIL_ENABLED`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`) configuradas adecuadamente

## Base de datos

- [ ] `docker compose ps` muestra `postgres` en estado healthy
- [ ] `DATABASE_URL` apunta a PostgreSQL local esperado
- [ ] `npm run prisma:validate` pasa
- [ ] `npm run prisma:generate` pasa
- [ ] `npm run prisma:migrate:status` confirma base al dia

## Aplicacion

- [ ] `npm run build` pasa
- [ ] `npm run test -- --runInBand` pasa
- [ ] `npm run test:e2e -- --runInBand` pasa
- [ ] `npm run lint:check` pasa

## Documentacion API

- [ ] Swagger UI disponible en `/api/docs`
- [ ] OpenAPI JSON disponible en `/api/docs-json`
- [ ] CU01-CU19 documentados
- [ ] CU16 y CU17 aclarados como heuristicas provisionales
- [ ] CU19 aclarado como exportacion PDF provisional

## Seguridad basica actual

- [ ] `ValidationPipe` global activo con `transform`, `whitelist` y `forbidNonWhitelisted`
- [ ] `HttpExceptionFilter` global activo
- [ ] `ResponseInterceptor` global activo
- [ ] CORS configurado por variables de entorno
- [ ] Helmet activo
- [ ] Rate limiting global activo
- [ ] JWT base configurado (`JWT_SECRET`, `JWT_EXPIRES_IN`)
- [ ] Bootstrap de registro controlado con `AUTH_REGISTER_ENABLED`
- [ ] Registro/login/me verificados
- [ ] Hash de contraseña activo con bcrypt
- [ ] RBAC activo con permisos refinados por método cuando aplica
- [ ] `LECTOR` limitado a `GET` no destructivos
- [ ] Roles de escritura acotados por responsabilidad funcional
- [ ] CU08 valida disponibilidad contra asignaciones activas y fechas planificadas de tareas
- [ ] CU09/CU10/CU11 bloquean asignaciones con solapamiento de agenda
- [ ] CU15 confirma recepcion, incrementa stock y actualiza orden completa a `RECIBIDA`
- [ ] CU15 calcula avance de orden solo con entregas `RECIBIDA`
- [ ] `/health` público para monitoreo externo
- [ ] `auth/register` controlado por configuración y `auth/login` público
- [ ] Seed admin disponible con `npm run seed:admin`

## Checklist de produccion

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` existe, tiene al menos 32 caracteres y no usa placeholders (`secret`, `changeme`, `dev-secret`, `test-secret`, etc.)
- [ ] `AUTH_REGISTER_ENABLED=false` o sin definir; nunca `true` en producción
- [ ] Admin inicial creado por seed/manual controlado, no por registro público abierto en producción
- [ ] `ADMIN_EMAIL` definido para bootstrap controlado
- [ ] `ADMIN_PASSWORD` fuerte, temporal y de al menos 12 caracteres
- [ ] `npm run seed:admin` ejecutado en entorno controlado
- [ ] Login verificado con usuario `ADMIN`
- [ ] Credenciales temporales de bootstrap eliminadas, rotadas o gestionadas como secreto después de usarlas
- [ ] `CORS_ORIGIN` limitado al frontend real, sin `*` salvo excepción revisada
- [ ] `THROTTLE_TTL` y `THROTTLE_LIMIT` ajustados al tráfico esperado
- [ ] Si `EMAIL_ENABLED=true`, la configuración SMTP es correcta, completa y no usa placeholders.
- [ ] Probar notificación de correo real (EMAIL) en entorno controlado.
- [ ] Asegurarse de no subir credenciales reales de email (`EMAIL_PASSWORD`) al repositorio.
- [ ] `REPORTS_DIR` configurado y la carpeta de reportes tiene permisos de escritura.
- [ ] Exportación de PDF (CU19) probada y generando archivos físicos reales.
- [ ] Almacenamiento local aceptado o reemplazado por storage externo (S3/Azure Blob) en producción.
- [ ] Política de respaldo y limpieza de la carpeta de reportes definida para producción.
- [ ] Integración AI verificada con Gemini y fallback heurístico funcionando (CU16 y CU17).
- [ ] `.env` real excluido del repositorio y gestionado como secreto del entorno
- [ ] `npm run prisma:migrate:deploy` usado para aplicar migraciones en despliegue productivo
- [ ] Matriz RBAC revisada antes de habilitar usuarios reales
- [ ] `ADMIN` reservado para operacion/soporte con acceso total
- [ ] `ENCARGADO_COMPRAS` validado para materiales, proveedores, ordenes, entregas y flujos IA de materiales
- [ ] `INGENIERO` validado para tareas, cronogramas, seguimiento, asignaciones tecnicas, alertas y reportes, sin escritura en compras/materiales
- [ ] `CONTRATISTA` validado para CU11 y consultas vinculadas, sin acceso a compras/materiales/clientes
- [ ] Endpoints `POST`, `PATCH` y `DELETE` probados con roles insuficientes para confirmar `403`

## Deudas tecnicas conocidas

- [ ] CU17 IA externa pendiente
- [ ] CU18 notificacion por WhatsApp y SMS pendiente
- [ ] RBAC por pertenencia/recurso pendiente cuando existan relaciones usuario-proyecto/contratista
- [ ] Auditoria de permisos a nivel de datos pendiente para evitar acceso transversal entre proyectos
- [ ] Calendario laboral avanzado pendiente para disponibilidad de trabajadores (jornadas, feriados, vacaciones, capacidad parcial)
- [ ] Estado parcial de orden pendiente si el negocio requiere distinguir recepción parcial en `EstadoOrdenCompra`

## Entrega recomendada

- [ ] Confirmar variables de entorno del equipo
- [ ] Confirmar Docker Compose oficial
- [ ] Confirmar ultimo estado de Prisma
- [ ] Confirmar build, unit, e2e y ESLint en verde
- [ ] Confirmar Swagger accesible antes de demo o handoff
