# Contexto del Proyecto SuArq

Este documento sirve como punto de partida para cualquier agente o desarrollador que se una a la construcción del **Frontend** del sistema SuArq.

## Estado del Backend (Completado y Cerrado)

El backend ya se encuentra completamente desarrollado, auditado y cerrado. Sus características principales son:

- **Stack:** NestJS, Prisma, PostgreSQL.
- **Arquitectura:** Capas / Domain-Driven Design / Clean Architecture.
- **Seguridad:** JWT, Roles (RBAC), Helmet, Rate Limiting, ValidationPipe estricto.
- **Documentación API:** Swagger disponible en `/api/docs` (por defecto en `http://localhost:3000/api/docs`).
- **Casos de Uso Completados:** 19 (CU01 al CU19), abarcando gestión de proyectos, clientes, cronogramas, tareas (fina/bruta), trabajadores, contratos, compras, proveedores, entregas y más.
- **Funcionalidades Avanzadas:** 
  - IA integrada (Google Gemini) para asignación de materiales (CU16) y pronósticos (CU17).
  - Generación de PDF físico real para reportes (CU19).
  - Envío de correos SMTP para notificaciones (CU18).
  - Cierre automático de órdenes de compra al completar entregas (CU15).
  - Disponibilidad real de agenda cruzada para trabajadores (CU08, CU09, CU10, CU11).
- **Regla Estricta:** No se debe modificar absolutamente nada del código, modelos o migraciones del backend. El frontend debe adaptarse a los contratos expuestos por Swagger.

## Contexto del Frontend (En Construcción)

El frontend se está construyendo desde cero con el siguiente stack y restricciones:

- **Stack Base:** React, TypeScript, Vite, HTML.
- **Estilos:** CSS Vanilla (o CSS Modules). No se usará Tailwind CSS ni librerías pesadas de UI (MUI, AntD, etc.) a menos que se solicite explícitamente en una fase tardía.
- **Estado Global/Manejo de Datos:** Provider para Auth. No Redux, no React Query todavía.
- **Arquitectura:** Estructura modular orientada a features y "casos de uso", reflejando el backend:
  - `src/app`: Proveedores globales, layout base y enrutamiento (`react-router-dom`).
  - `src/shared`: Componentes UI reutilizables (Button, Input, Table), hooks, utilidades y cliente HTTP.
  - `src/features`: Lógica de negocio encapsulada por caso de uso (p. ej. `auth`, `cu01-gestionar-clientes`, `cu16-asignacion-materiales-ia`).
- **Autenticación:** JWT guardado en LocalStorage. El flujo de login (`/auth/login`) genera un token que se envía por `Bearer` en los subsecuentes requests (`/auth/me` para obtener el perfil y RBAC).

### Fase Actual

El proyecto se encuentra en la **Fase Base**, donde se está construyendo:
- El ruteo (`AppRouter`, `ProtectedRoute`).
- Proveedor de Autenticación (`AuthProvider`).
- Layout principal del sistema (`DashboardLayout`, `Sidebar`).
- Componentes base (`Button`, `Card`, `Table`).
- Carpetas vacías / placeholders para los 19 Casos de Uso. 

El siguiente agente deberá continuar construyendo caso de uso por caso de uso basándose en esta estructura e integrando los endpoints mapeados en Swagger.
