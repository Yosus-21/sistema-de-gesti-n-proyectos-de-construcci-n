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

- `NODE_ENV`
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
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NOMBRE`
- `ADMIN_OVERWRITE_PASSWORD`

Ejemplo actual:

```env
# App
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=suarq_db
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/suarq_db?schema=public"

# Security
JWT_SECRET=change-me-in-production-use-32-plus-random-characters
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=10
AUTH_REGISTER_ENABLED=true

# Admin bootstrap
ADMIN_EMAIL=admin@suarq.local
ADMIN_PASSWORD=change-me-admin-password
ADMIN_NOMBRE=Administrador
ADMIN_OVERWRITE_PASSWORD=false

# CORS
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_CREDENTIALS=true

# Rate limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

## Ambientes y secretos

El backend distingue `development`, `test` y `production` mediante `NODE_ENV`.

- `development`: permite fallback controlado de `JWT_SECRET` si no se define y permite `AUTH_REGISTER_ENABLED=true` para bootstrap local.
- `test`: permite fallback controlado de `JWT_SECRET`; los e2e configuran explícitamente `NODE_ENV=test`, `JWT_SECRET` y `AUTH_REGISTER_ENABLED=true` desde `test/setup-env.ts`.
- `production`: exige `JWT_SECRET` fuerte, aleatorio y de al menos 32 caracteres. La app falla al arrancar si falta o si usa valores débiles como `secret`, `changeme`, `dev-secret`, `test-secret` o placeholders similares.

En producción, `AUTH_REGISTER_ENABLED` debe quedar en `false` o no definirse. Si `AUTH_REGISTER_ENABLED=true` con `NODE_ENV=production`, la app falla al arrancar para evitar registro público accidental de usuarios `ADMIN`.

El usuario administrador inicial debe crearse por seed/manual controlado o, en un entorno seguro no productivo, habilitando temporalmente `AUTH_REGISTER_ENABLED=true` para bootstrap y deshabilitándolo inmediatamente después. No subas `.env` al repositorio ni uses credenciales reales de producción en archivos versionados.

También ajusta `CORS_ORIGIN` al dominio real del frontend en producción; evita `*` salvo escenarios explícitamente controlados. `THROTTLE_TTL` y `THROTTLE_LIMIT` son configurables por ambiente según el nivel esperado de tráfico.

## Bootstrap de administrador

Para crear o asegurar el usuario `ADMIN` inicial sin abrir `POST /auth/register` en producción:

1. Configura `ADMIN_EMAIL`, `ADMIN_PASSWORD` y opcionalmente `ADMIN_NOMBRE`.
2. Ejecuta:

```bash
npm run seed:admin
```

3. En producción mantén `AUTH_REGISTER_ENABLED=false` o sin definir.
4. Verifica login con `POST /auth/login` usando el correo configurado.

El seed no imprime contraseñas, no guarda contraseñas en texto plano y no duplica usuarios existentes por correo. Si el usuario ya existe, asegura rol `ADMIN` y `activo=true`; por defecto no cambia la contraseña. Para rotar explícitamente la contraseña del admin existente, usa `ADMIN_OVERWRITE_PASSWORD=true` solo durante una ejecución controlada y vuelve a dejarlo en `false`.

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
- `npm run seed:admin`
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
- `JWT_SECRET` es obligatorio y se valida como secreto fuerte cuando `NODE_ENV=production`.
- `AUTH_REGISTER_ENABLED=true` se permite en `development`/`test`; en `production` hace fallar el arranque.

## Autenticación y RBAC

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

- `POST /auth/register` depende de `AUTH_REGISTER_ENABLED`; en desarrollo/test puede permanecer habilitado para bootstrap, pero en producción debe quedar deshabilitado.
- `POST /auth/login` permanece público.
- `GET /auth/me` requiere token Bearer válido.
- El RBAC combina roles base por módulo/controller con permisos refinados por método cuando la lectura o escritura necesita una política distinta.
- `LECTOR` puede consultar endpoints `GET` no destructivos habilitados, pero no puede crear, modificar, eliminar ni ejecutar operaciones de cambio de estado.
- Los endpoints `/health` de CU01-CU19 son públicos para monitoreo externo.

## Roles y permisos

| Rol                 | Permisos principales                                                                                                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ADMIN`             | Acceso total a todos los módulos protegidos.                                                                                                                                                                                                   |
| `GESTOR_PROYECTO`   | Gestiona clientes, proyectos, cronogramas, tareas, seguimiento, contratos, trabajadores, asignaciones, alertas y reportes. Puede consultar materiales, proveedores, ordenes, entregas y resultados IA relacionados con planificacion.          |
| `INGENIERO`         | Gestiona tareas, cronogramas, seguimiento, asignaciones tecnicas, alertas y reportes. Puede consultar proyectos, trabajadores y materiales, pero no modifica clientes, proveedores, compras ni stock.                                          |
| `ENCARGADO_COMPRAS` | Gestiona materiales, proveedores, ordenes de compra, entregas, asignacion IA de materiales y pronosticos. Puede consultar proyectos, tareas y reportes necesarios para compras, pero no modifica clientes, proyectos, cronogramas o contratos. |
| `CONTRATISTA`       | Consulta proyectos, tareas, contratos vinculados, alertas y CU11 asignaciones por contratista. No modifica materiales, compras, clientes ni contratos generales.                                                                               |
| `LECTOR`            | Solo accede a `GET` no destructivos expresamente habilitados. No tiene permisos `POST`, `PATCH` ni `DELETE`.                                                                                                                                   |

## Disponibilidad de trabajadores

CU08 verifica disponibilidad real contra asignaciones existentes del trabajador. La regla compara el rango solicitado con `fechaInicioPlanificada` y `fechaFinPlanificada` de cada tarea asignada; las asignaciones `PENDIENTE`, `CONFIRMADA` y `REASIGNADA` ocupan agenda, mientras que `CANCELADA` no bloquea disponibilidad.

CU09, CU10 y CU11 reutilizan la misma validacion al asignar o reasignar trabajadores. Si hay solapamiento, la asignacion se rechaza con `409 Conflict`.

## Recepción de materiales y órdenes

CU15 confirma recepción de materiales, incrementa el stock y recalcula el avance de la orden de compra usando solo entregas `RECIBIDA`. Cuando todas las líneas tienen cantidad recibida acumulada suficiente, la orden pasa automáticamente a `RECIBIDA`.

El enum actual de órdenes no incluye estado parcial; por eso una orden parcialmente recibida conserva su estado vigente, normalmente `EMITIDA`, hasta que todas sus líneas estén completas.

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

- CU16 puede usar Gemini API vía Google AI Studio cuando AI_ENABLED=true; si está deshabilitado o falla, usa fallback heurístico seguro.
- CU17 puede usar Gemini API vía Google AI Studio cuando AI_ENABLED=true; si está deshabilitado o falla, usa fallback heurístico seguro. Ambas integraciones de IA (CU16 y CU17) comparten las mismas variables de entorno.
- CU18 soporta notificaciones internas y envío por email vía SMTP configurable. WhatsApp/SMS quedan pendientes.
- CU19 genera archivos PDF reales en REPORTS_DIR (almacenamiento local por ahora) y guarda la ruta en rutaArchivoPdf. En producción podría reemplazarse por un almacenamiento en la nube (S3, etc).
- La disponibilidad de CU08 considera asignaciones y tareas existentes, pero aun no modela jornadas laborales, feriados, vacaciones, capacidad parcial por dia ni ownership por proyecto/recurso.
- CU15 no tiene estado parcial de orden porque `EstadoOrdenCompra` solo define `BORRADOR`, `EMITIDA`, `RECIBIDA` y `CANCELADA`.

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
