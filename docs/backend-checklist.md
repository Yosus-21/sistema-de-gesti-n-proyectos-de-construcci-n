# Backend Delivery Checklist

## Entorno

- [ ] Node.js 22 disponible
- [ ] npm disponible
- [ ] Docker Compose operativo
- [ ] `.env` derivado de `.env.example` cuando aplique
- [ ] Variables de seguridad (`CORS_*`, `THROTTLE_*`) definidas para el entorno
- [ ] `AUTH_REGISTER_ENABLED` definido según el entorno

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
- [ ] RBAC básico activo con lectura controlada para `LECTOR`
- [ ] `/health` público para monitoreo externo
- [ ] `auth/register` controlado por configuración y `auth/login` público

## Deudas tecnicas conocidas

- [ ] CU08 disponibilidad/calendario real pendiente
- [ ] CU15 no actualiza automaticamente `ordenCompra.estadoOrden` a `RECIBIDA`
- [ ] CU16 IA externa pendiente
- [ ] CU17 IA externa pendiente
- [ ] CU18 notificacion externa real pendiente
- [ ] CU19 generacion PDF real pendiente
- [ ] RBAC granular por roles/permisos pendiente
- [ ] Afinar permisos específicos por método/acción más allá de la primera política de lectura para `LECTOR`

## Entrega recomendada

- [ ] Confirmar variables de entorno del equipo
- [ ] Confirmar Docker Compose oficial
- [ ] Confirmar ultimo estado de Prisma
- [ ] Confirmar build, unit, e2e y ESLint en verde
- [ ] Confirmar Swagger accesible antes de demo o handoff
