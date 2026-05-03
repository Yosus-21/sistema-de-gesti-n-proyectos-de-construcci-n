# SuArq Backend

Backend NestJS del sistema **SuArq**, orientado a la gestion de proyectos de construccion.

## Resumen

- Arquitectura por capas: `common`, `domain`, `infrastructure`, `use-cases`
- ORM principal: Prisma
- Base de datos: PostgreSQL
- Documentacion OpenAPI: Swagger en `/api/docs`
- Cobertura funcional: CU01-CU19
- Validacion automatica: build, unit tests, e2e y ESLint

## Stack tecnologico

- Node.js 22
- NestJS 11
- TypeScript
- Prisma
- PostgreSQL
- Docker Compose
- Jest + Supertest
- ESLint + Prettier
- Swagger / OpenAPI

## Requisitos previos

- Node.js 22
- npm
- Docker Desktop o engine compatible con Docker Compose

## Variables de entorno

Toma `.env.example` como base para un `.env` local si lo necesitas.

Variables esperadas:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_DATABASE`
- `DATABASE_URL`
- `CORS_ENABLED`
- `CORS_ORIGIN`
- `CORS_METHODS`
- `CORS_CREDENTIALS`
- `THROTTLE_TTL`
- `THROTTLE_LIMIT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `BCRYPT_SALT_ROUNDS`
- `AUTH_REGISTER_ENABLED`

Ejemplo actual:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=suarq_db
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/suarq_db?schema=public"
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_CREDENTIALS=true
THROTTLE_TTL=60
THROTTLE_LIMIT=100
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=10
AUTH_REGISTER_ENABLED=true
```

## Instalacion

```bash
npm install
```

## PostgreSQL local con Docker

Levantar solo PostgreSQL:

```bash
npm run docker:db
```

Levantar entorno de desarrollo completo:

```bash
npm run docker:dev
```

Detener contenedores:

```bash
npm run docker:down
```

## Prisma

Validar esquema:

```bash
npx prisma validate
```

Generar Prisma Client:

```bash
npx prisma generate
```

Ver estado de migraciones:

```bash
npx prisma migrate status
```

Aplicar migraciones en entorno local si hiciera falta:

```bash
npx prisma migrate dev
```

## Ejecutar la API

Desarrollo:

```bash
npm run start:dev
```

Produccion local tras compilar:

```bash
npm run build
npm run start:prod
```

Por defecto la API expone `http://localhost:3000`.

## Swagger / OpenAPI

- UI Swagger: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Documento JSON: [http://localhost:3000/api/docs-json](http://localhost:3000/api/docs-json)

Notas:

- CU16 y CU17 estan documentados como heuristicas internas provisionales.
- CU19 documenta la exportacion PDF como provisional, sin archivo fisico real.

## Scripts principales

- `npm run start:dev`: iniciar backend en desarrollo
- `npm run build`: compilar proyecto
- `npm run test -- --runInBand`: pruebas unitarias
- `npm run test:e2e -- --runInBand`: pruebas e2e
- `npx eslint "{src,apps,libs,test}/**/*.ts"`: verificacion ESLint sin `--fix`
- `npm run docker:db`: levantar PostgreSQL local
- `npm run docker:dev`: levantar app + PostgreSQL con Docker
- `npm run docker:down`: detener contenedores

## Comandos operativos

- `npm run prisma:validate`
- `npm run prisma:generate`
- `npm run prisma:migrate:status`
- `npm run lint:check`
- `npm run test:unit`
- `npm run test:e2e`

## Seguridad base

- CORS configurable por variables de entorno
- Helmet activo de forma global
- Rate limiting global con `@nestjs/throttler`
- `ValidationPipe` estricto con `whitelist` y `forbidNonWhitelisted`
- JWT base disponible para autenticación

Notas:

- `CORS_ORIGIN` acepta un origen, varios separados por coma o `*` si se configura explicitamente.
- `THROTTLE_TTL` se interpreta en segundos y se transforma internamente a milisegundos para `@nestjs/throttler`.
- `JWT_SECRET` debe reemplazarse por un secreto fuerte en producción.
- `AUTH_REGISTER_ENABLED` puede quedar en `true` durante bootstrap local, pero en producción se recomienda llevarlo a `false` después de crear el usuario administrador inicial.

## Autenticación y RBAC inicial

- Registro inicial: `POST /auth/register`
- Login JWT: `POST /auth/login`
- Usuario autenticado actual: `GET /auth/me`
- Roles disponibles:
  - `ADMIN`
  - `GESTOR_PROYECTO`
  - `INGENIERO`
  - `ENCARGADO_COMPRAS`
  - `CONTRATISTA`
  - `LECTOR`

Flujo recomendado:

1. Registrar usuario inicial en entorno controlado.
2. Hacer login para obtener `accessToken`.
3. Usar `Authorization: Bearer <token>` en endpoints protegidos.

Swagger:

- UI Swagger: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Usa el botón **Authorize** con el token Bearer.

Nota:

- `POST /auth/register` depende de `AUTH_REGISTER_ENABLED`; en desarrollo puede permanecer habilitado y en producción se recomienda deshabilitarlo tras el bootstrap inicial.
- `POST /auth/login` permanece público.
- `GET /auth/me` requiere token Bearer válido.
- El RBAC actual es inicial: combina roles base por módulo/controller con permisos de lectura por método para `LECTOR`.
- `LECTOR` puede consultar endpoints `GET` habilitados, pero no puede crear, modificar, eliminar ni ejecutar operaciones de cambio de estado.
- Los endpoints `/health` de CU01-CU19 son públicos para monitoreo externo.

## Estructura principal

```text
src/
├── common/
├── domain/
├── infrastructure/
└── use-cases/

prisma/
test/
docs/
```

## Estado funcional

Casos de uso implementados:

- CU01 Gestionar Clientes
- CU02 Creacion de Proyectos
- CU03 Gestion de Tareas de Obra Fina
- CU04 Gestion de Tareas de Obra Bruta
- CU05 Creacion de Cronograma
- CU06 Gestion de Seguimiento
- CU07 Gestion de Contrato con Contratista
- CU08 Gestion de Trabajador
- CU09 Asignacion de Tareas de Obra Bruta
- CU10 Asignacion de Tareas de Obra Fina
- CU11 Asignacion de Tareas por Contratista
- CU12 Registro de Materiales
- CU13 Gestion de Proveedores
- CU14 Gestion de Ordenes de Compra
- CU15 Entrega de Materiales
- CU16 Asignacion eficiente de materiales mediante IA
- CU17 Pronostico de materiales mediante IA
- CU18 Alertas y Notificaciones
- CU19 Reportes

## Advertencias tecnicas conocidas

- CU08 devuelve disponibilidad provisional; aun no implementa calendario real de ocupacion.
- CU15 no actualiza automaticamente `ordenCompra.estadoOrden` a `RECIBIDA`.
- CU16 usa heuristicas internas provisionales, sin IA externa real.
- CU17 usa heuristicas internas provisionales, sin modelo predictivo externo real.
- CU18 registra notificaciones de forma interna y provisional; no integra email, WhatsApp ni SMS.
- CU19 exporta PDF de forma provisional y no genera archivo fisico.
- CU07 persiste `ContratoDetalle` en esquema, pero el flujo actual de alta/modificacion se concentra en el contrato principal y en el calculo del costo total.

## Verificacion recomendada antes de entrega

```bash
npx prisma validate
npx prisma generate
npx prisma migrate status
npm run build
npm run test -- --runInBand
npm run test:e2e -- --runInBand
npx eslint "{src,apps,libs,test}/**/*.ts"
```
