# ThePower LMS Platform

Plataforma multi-tenant implementada con arquitectura de microservicios.

## Arquitectura

- **tenant-service**: Gestión de clientes, branding y config.
- **iam-service**: Identidad, RBAC y SSO.
- **catalog-service**: Cursos, módulos y versionado.
- **enrollment-service**: Inscripciones y asignaciones.
- **progress-service**: Tracking granular de avance.
- **gamification-service**: Motor de XP, niveles y badges.
- **fundae-service**: Compliance, expedientes y reportes.

## Setup

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar bases de datos (Docker):
   ```bash
   npm run docker:up
   ```
3. Ejecutar servicios en modo desarrollo:
   ```bash
   npm run dev
   ```

## Documentación

- [OpenAPI Spec](./docs/openapi.yaml)
- [Event Model](./docs/events.yaml)
- [Backlog](./docs/backlog.md)
