# Especificaciones del Rol: Client Admin (Portal de Cliente / Manager B2B)

Este documento detalla las funcionalidades clave y las historias de usuario (User Stories) diseñadas para el **Administrador de Cliente** dentro de New_LMS. Este portal permite a las empresas gestionar su propio talento y formación de forma autónoma.

---

## 1. Funcionalidades Principales

### 1.1 Gestión de Organización y Usuarios
- **Panel de Control de Empleados**: Gestión del ciclo de vida de los alumnos de la empresa (Altas, Bajas, Edición).
- **Importación Masiva (Smart Import)**: Herramienta de carga automática vía CSV con validación de campos para grandes plantillas.
- **Estructura Organizativa**: Capacidad para crear departamentos, sedes o centros de coste para agrupar a los alumnos.

### 1.2 Gestión de Formación y Matrículas
- **Catálogo Corporativo**: Visualización de los cursos disponibles específicamente para su organización.
- **Asignación de "Seats" (Plazas)**: Gestión de licencias compradas y asignación de cursos a empleados específicos o departamentos enteros.
- **Control de Convocatorias**: Creación de grupos privados (cohortes) para sus empleados con fechas personalizadas.

### 1.3 Analítica de Negocio y Reporting
- **Business Dashboard**: Vista ejecutiva de KPIs: % de finalización, ROI de formación, y horas logradas por departamento.
- **Generador de Reportes On-demand**: Creación de informes personalizados listos para descargar en PDF o Excel.
- **Seguimiento de ROI**: Visualización de la evolución de las competencias adquiridas por la plantilla.

### 1.4 Cumplimiento y Finanzas (FUNDAE)
- **Gestor de Bonificaciones**: Panel específico para monitorizar qué cursos son bonificables y el estado de cumplimiento de los alumnos.
- **Centro de Facturación**: Acceso a facturas, estados de pago y gestión de planes de suscripción corporativos.
- **Auditoría de Acceso**: Descarga de registros de actividad de sus empleados para justificaciones internas.

---

## 2. Historias de Usuario (User Stories)

| ID | Título de la User Story | Descripción Breve | Prioridad |
|----|-------------------------|-------------------|-----------|
| **US.CLNT.01** | **Importación de Plantilla** | Como Manager, quiero subir un CSV con mis 200 empleados para que se creen sus cuentas y se envíen los accesos automáticamente. | P0 |
| **US.CLNT.02** | **Reporte de Progreso por Depto** | Como Manager, quiero filtrar el rendimiento por el departamento de "Ventas" para ver si están completando la formación obligatoria. | P0 |
| **US.CLNT.03** | **Asignación de Licencias** | Como Manager, quiero ver cuántas plazas me quedan en el curso de "Liderazgo" y asignarlas a los nuevos directivos. | P0 |
| **US.CLNT.04** | **Monitor de Bonificación FUNDAE** | Como Manager, quiero recibir una alerta si un grupo de empleados está a punto de perder la bonificación por falta de actividad. | P1 |
| **US.CLNT.05** | **Autogestión de Perfiles** | Como Manager, quiero poder resetear la contraseña de un empleado que ha bloqueado su cuenta sin contactar al soporte global. | P1 |
| **US.CLNT.06** | **Análisis de Competencias** | Como Manager, quiero ver un gráfico de araña con las habilidades ganadas por mi empresa tras 6 meses de uso de la plataforma. | P2 |
| **US.CLNT.07** | **Personalización de Marca (White Label)** | Como Manager, quiero subir el logo de mi empresa para que mis empleados sientan que el portal es corporativo. | P2 |
| **US.CLNT.08** | **Descarga de Facturas** | Como Manager, quiero acceder al histórico de pagos para enviárselo a mi departamento de contabilidad. | P1 |

---

## 3. Valor Diferencial para el Cliente B2B

1. **Autonomía Total**: Menos dependencia del soporte técnico del LMS.
2. **Visibilidad de Datos**: Datos reales para la toma de decisiones en RRHH.
3. **Agilidad en el Onboarding**: Despliegue masivo de formación en minutos.
4. **Seguridad Enterprise**: Cumplimiento normativo y control de datos unificado.
