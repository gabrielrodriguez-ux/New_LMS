# Especificaciones del Rol: Super Admin (Backoffice Global)

Este documento detalla **todas** las funcionalidades granulares del **Backoffice** de New_LMS. Este es el centro de control total de la infraestructura, diseñado para los administradores globales de la plataforma.

---

## 1. Gestión del Catálogo y Contenido (Classrooms)

### 1.1 Estructura del curso
- Crear, editar y eliminar Cursos globales.
- Definir jerarquía de 3 niveles: Módulos -> Unidades -> Contenidos.
- Sistema Drag & Drop para reordenar módulos y unidades.
- Sistema Drag & Drop para mover contenidos entre diferentes unidades.
- Configurar visibilidad global de un curso (Borrador vs Publicado).

### 1.2 Editor de Contenidos (Versátil)
- Carga manual de archivos (PDF, MP4, MP3, DOCX) con almacenamiento en Supabase.
- Editor de texto enriquecido para lecciones basadas en cuerpo de texto (Markdown).
- Edición de metadatos (XP asignada, duración estimada, recompensas).
- Duplicación de lecciones para reutilización.

### 1.3 AI Content Studio (Integración Gemini)
- Generación automática de Podcasts educativos a partir de fuentes (PDF/Texto).
- Generación de videos sintéticos con avatares de IA.
- Generación automática de resúmenes ejecutivos.
- Creación de Cuestionarios (Quizzes) basados en el contenido de la fuente.
- Panel de "Oversight" para aprobar contenido generado por IA.

---

## 2. Gestión B2B (Clients / Tenancy)

### 2.1 Administración de Clientes (Tenants)
- Creación de organizaciones cliente (Empresas).
- Configuración de dominios y subdominios personalizados por cliente.
- Gestión de cuotas de almacenamiento y límite de usuarios por contrato.
- Activación/Desactivación global de una organización cliente.

### 2.2 Branding y Whitelabel
- Configuración de logo corporativo para cada portal de cliente.
- Selección de paletas de colores personalizadas para el entorno del cliente.
- Configuración de correos electrónicos de remitente personalizado (SMTP/DNS).

### 2.3 Certificaciones Corporativas
- Diseño de plantillas de diplomas con variables dinámicas (Nombre, Fecha, ID).
- Configuración de validez temporal de certificados.

---

## 3. Cumplimiento Normativo (FUNDAE)

### 3.1 Auditoría Legal
- Monitorización del umbral de actividad (75% mandatorio para bonificación).
- Generador de ficheros XML/CSV con el formato oficial de FUNDAE.
- Visualización de Logs de conexión por IP y marcas de tiempo (Login/Logout).
- Registro de tiempo de permanencia efectivo por unidad didáctica.

### 3.2 Reportes de Inspección
- Botón de pánico para auditoría: Descarga instantánea de todo el expediente de un curso.
- Validación de identidad del alumno (Integración con servicios de reconocimiento si aplica).

---

## 4. Estrategia de Retención (Gamification)

### 4.1 Economía de Puntos (XP)
- Definición de tablas de experiencia (XP por lección, por quiz, por login diario).
- Configuración de multiplicadores de puntos por tiempo limitado.

### 4.2 Progresión y Niveles
- Creación de niveles de prestigio (Nivel 1, 2, ... N).
- Definición de requisitos de XP para subir de nivel.

### 4.3 Logros y Badges
- Diseño de medallas visuales (SVG/Iconos).
- Configuración de "Triggers" para insignias (ej: "Completar 5 cursos" -> Badge "Maestro de Ventas").

---

## 5. Gestión de Usuarios y Seguridad (IAM)

### 5.1 Control de Accesos
- Asignación de roles granulares (Admin, Tutor, Instructor, Inspector).
- Gestión de permisos específicos por rol (RBAC).
- Reset de sesiones y contraseñas de cualquier usuario del sistema.

### 5.2 Monitorización de Sesiones
- Panel de sesiones activas en tiempo real.
- Histórico de inicios de sesión con geolocalización por IP.
- Detección de cuentas compartidas (Mismo usuario en diferentes IPs/Dispositivos).

---

## 6. Historias de Usuario (User Stories de Backoffice)

| ID | Título | Necesidad |
|----|--------|-----------|
| **US.BO.01** | **Estructura Dinámica** | Quiero mover una unidad entera de un módulo a otro sin perder los datos asociados. |
| **US.BO.02** | **Aislamiento B2B** | Necesito asegurar que el Cliente A nunca vea los usuarios ni cursos privados del Cliente B. |
| **US.BO.03** | **Exportación Legal 1-Click** | Quiero generar el reporte de FUNDAE de un grupo de 500 personas en menos de 10 segundos. |
| **US.BO.04** | **Ajuste de Gamificación** | Quiero cambiar globalmente la XP que dan los videos de 10 a 20 puntos para incentivar el consumo. |
| **US.BO.05** | **Auditoría de Sesiones** | Quiero cerrar todas las sesiones abiertas de una empresa que ha dejado de pagar sus licencias. |
| **US.BO.06** | **Clonación de Arquitectura** | Quiero copiar la estructura de un curso de "Derecho" para empezar uno de "Contabilidad" sin empezar de cero. |
| **US.BO.07** | **Refinamiento IA** | Quiero editar el guion de un podcast generado por IA antes de que se sintetice la voz final. |
| **US.BO.08** | **Personalización de Tenant** | Quiero configurar un servidor SSO (OAuth/SAML) específico para un cliente Enterprise grande. |
