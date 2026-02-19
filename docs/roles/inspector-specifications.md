# Especificaciones del Rol: Inspector / Auditor Académico

Este documento detalla las funcionalidades clave y las historias de usuario (User Stories) diseñadas para el rol de **Inspector** dentro de New_LMS. Este rol es crítico para entornos B2B donde el cumplimiento normativo (FUNDAE) es un requisito legal.

---

## 1. Funcionalidades Principales

### 1.1 Dashboard de Cumplimiento (Compliance Dashboard)
- **Vista de KPIs Normativos**: Resumen del número de alumnos por debajo del umbral de asistencia (ej. 75% FUNDAE).
- **Consola de Monitorización en Vivo**: Visualización en tiempo real de los alumnos que están consumiendo contenido en ese momento.
- **Relación de Cohortes Asignadas**: Vista filtrada de solo aquellos programas y promociones que el inspector tiene permiso legal para auditar.

### 1.2 Auditoría y Trazabilidad
- **Registro Inalterable de Actividad (Audit Log)**: Acceso detallado a marcas de tiempo de inicio de sesión, tiempo por lección e IP de conexión.
- **Verificador de Progreso Real**: Herramienta para comparar el porcentaje de progreso reportado vs. el tiempo real invertido.
- **Gestión de Incidencias de Asistencia**: Capacidad para marcar irregularidades detectadas durante la monitorización.

### 1.3 Generación de Reportes y Expedientes
- **Exportación de Expediente Digital**: Generación de un archivo PDF completo con toda la actividad de un alumno para inspecciones externas.
- **Reporte Agregado para FUNDAE**: Descarga de archivos CSV/Excel con el formato exacto requerido para la bonificación de formación.
- **Archivo Histórico**: Acceso a datos de cohortes finalizadas para auditorías retrospectivas (hasta 4 años).

---

## 2. Historias de Usuario (User Stories)

| ID | Título de la User Story | Descripción Breve | Prioridad |
|----|-------------------------|-------------------|-----------|
| **US.INSP.01** | **Dashboard de Salud de Asistencia** | Como Inspector, quiero ver qué alumnos están por debajo del 75% de asistencia para avisar a la empresa cliente. | P0 |
| **US.INSP.02** | **Exportación de Log de Actividad** | Como Inspector, quiero descargar el detalle de conexiones de una cohorte para presentar en una auditoría. | P0 |
| **US.INSP.03** | **Monitorización de Sesiones Activas** | Como Inspector, quiero ver quién está conectado ahora mismo para realizar una "visita" virtual de inspección. | P1 |
| **US.INSP.04** | **Búsqueda de Irregularidades** | Como Inspector, quiero filtrar alumnos que han completado módulos en un tiempo excesivamente corto para investigar posible fraude. | P1 |
| **US.INSP.05** | **Descarga de Expediente Individual** | Como Inspector, quiero un botón para generar un PDF con todos los hitos y asistencia de un alumno específico. | P0 |
| **US.INSP.06** | **Filtro de Cohortes por Cliente** | Como Inspector, quiero filtrar por organización cliente para generar reportes agrupados por empresa (B2B). | P1 |

---

## 3. Diferencias Clave: Inspector vs. Otros Roles

| Característica | Inspector | Tutor | Admin |
|----------------|-----------|-------|-------|
| **Propósito** | Verificación Legal | Acompañamiento | Gestión Total |
| **Modo de Acceso** | "Solo lectura" (Read-only) | Lectura/Escritura (Feedback) | Control Total |
| **Enfoque** | Normativa/Compliance | Aprendizaje/Progreso | Operaciones/Negocio |
| **Salida Principal** | Reportes de Auditoría | Alumnos Graduados | Plataforma Activa |
