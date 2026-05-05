# SuArq Frontend

Sistema de Gestión de Proyectos de Construcción (SuArq). Una aplicación moderna, segura y eficiente para la administración total de obras.

## 🚀 Estado del Proyecto

El frontend de SuArq se encuentra **100% implementado** en su fase funcional, integrando todos los casos de uso definidos (CU01 a CU19), un sistema de autenticación robusto y control de acceso basado en roles (RBAC) visual.

## 🛠️ Tecnologías Principales

- **React 19**: Biblioteca para interfaces de usuario.
- **TypeScript**: Tipado estático para mayor seguridad y mantenibilidad.
- **Vite**: Herramienta de construcción ultrarrápida.
- **React Router DOM**: Gestión de navegación y rutas protegidas.
- **Vanilla CSS**: Diseño premium basado en variables CSS, sin dependencias externas pesadas.

## 📦 Módulos Implementados

1.  **Seguridad y Sesión**: AuthProvider, Login, RBAC Visual.
2.  **Dashboard**: Resumen inteligente de indicadores clave.
3.  **Gestión de Proyectos**: Clientes (CU01), Proyectos (CU02), Cronogramas (CU05), Tareas (CU03/04), Seguimiento (CU06).
4.  **Recursos Humanos**: Trabajadores (CU08), Contratos (CU07), Asignaciones (CU09/10/11).
5.  **Logística e Inventario**: Materiales (CU12), Proveedores (CU13), Órdenes de Compra (CU14), Entregas (CU15).
6.  **Inteligencia Artificial**: Asignación IA (CU16), Pronóstico de Materiales (CU17).
7.  **Comunicación**: Alertas y Notificaciones (CU18), Reportes (CU19).

## 🔐 Autenticación y RBAC

- **JWT**: Autenticación persistente mediante tokens.
- **Roles Soportados**:
    - `ADMIN`: Acceso total.
    - `GESTOR_PROYECTO`: Gestión operativa de proyectos e IA.
    - `INGENIERO`: Seguimiento técnico y tareas.
    - `ENCARGADO_COMPRAS`: Logística y proveedores.
    - `CONTRATISTA`: Vista limitada a sus asignaciones y contratos.
    - `LECTOR`: Acceso de solo lectura en todo el sistema.
- **Manejo de Errores**:
    - `401 Unauthorized`: Cierre de sesión automático.
    - `403 Forbidden`: Mensajes de error informativos y redirección a página de acceso denegado.
    - `ProtectedRoute`: Protección de rutas a nivel de Router.
    - `Can Component`: Control granular de visibilidad de acciones (Botones Crear/Editar/Eliminar).

## ⚙️ Configuración

1.  **Variables de Entorno**:
    Crea un archivo `.env` basado en `.env.example`:
    ```env
    VITE_API_URL=http://localhost:3000
    ```

    El frontend concatena `VITE_API_URL` con paths como `/auth/login`, por lo que la URL final correcta para autenticación local es `http://localhost:3000/auth/login`.

2.  **Instalación**:
    ```bash
    npm install
    ```

3.  **Desarrollo**:
    ```bash
    npm run dev
    ```

4.  **Producción**:
    ```bash
    npm run build
    ```

## 🏗️ Arquitectura

Basada en **Features/Casos de Uso**:
- `src/app/`: Configuración core (Router, Layouts, Providers).
- `src/shared/`: Infraestructura compartida (API Client, UI Components, Utils).
- `src/features/`: Lógica de negocio encapsulada por caso de uso.

## ⚠️ Limitaciones y Notas Técnicas

- La seguridad real **siempre** la impone el Backend. El RBAC visual del frontend mejora la experiencia de usuario y evita errores, pero no reemplaza la validación de servidor.
- No se utilizan manejadores de estado pesados (Redux/Zustand) por simplicidad y siguiendo las restricciones del proyecto; se utiliza `context` y `hooks` personalizados.
- Los reportes PDF se generan en el servidor y el frontend solo gestiona el flujo de descarga/visualización.

## 🔮 Siguiente Fase Sugerida

1. **Code Splitting**: Implementar `React.lazy()` + `Suspense` para reducir el bundle inicial (actualmente ~522 KB).
2. **Testing**: Añadir tests unitarios con Vitest y tests e2e con Playwright/Cypress.
3. **Internacionalización**: Soporte multi-idioma con `react-i18next` si se requiere.
4. **PWA**: Configurar Service Worker para uso offline en obra.
5. **CI/CD**: Pipeline de GitHub Actions para build, lint y deploy automático.

---
© 2026 SuArq - Todos los derechos reservados.
