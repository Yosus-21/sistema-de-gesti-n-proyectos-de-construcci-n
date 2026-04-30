# API NestJS - Gestion de Proyectos de Construccion

Proyecto base creado con NestJS y preparado para:

- desarrollo local con Node.js
- ejecucion con Docker
- subida a GitHub con `.gitignore`

## Requisitos

- Node.js 22 o superior
- npm
- Docker Desktop

## Ejecutar en local

```bash
npm install
npm run start:dev
```

La API quedara disponible en `http://localhost:3000`.

## Ejecutar con Docker en modo desarrollo

```bash
docker compose up --build
```

O usando el script del proyecto:

```bash
npm run docker:dev
```

## Detener Docker

```bash
docker compose down
```

O usando el script:

```bash
npm run docker:down
```

## Construir imagen para produccion

```bash
docker build --target production -t gestion-proyectos-api .
```

## Ejecutar imagen de produccion

```bash
docker run --rm -p 3000:3000 --name gestion-proyectos-api gestion-proyectos-api
```

## Variables de entorno

Toma `.env.example` como base si luego quieres crear un archivo `.env`.

```env
PORT=3000
```

## Subir a GitHub

```bash
git init
git add .
git commit -m "Proyecto base con NestJS y Docker"
```

Luego conectas tu repositorio remoto y haces `git push`.
