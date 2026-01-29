    # Documento de Requisitos del Producto (PRD) - New_LMS

    **Versión**: 1.1  
    **Estado**: Consolidado (Basado en Repositorio)  
    **Fecha**: 28 de Enero, 2026

    ---

    ## 1. Resumen Ejecutivo

    **New_LMS** es un ecosistema educativo B2B de vanguardia que combina la potencia de la inteligencia artificial generativa con una arquitectura de microservicios robusta y escalable. Diseñado para el mercado corporativo e institucional, permite a las organizaciones crear, gestionar y auditar programas formativos de alta calidad con un enfoque especial en el cumplimiento normativo (FUNDAE) y la experiencia de usuario premium (UX Pro Max).

    ---

    ## 2. Descripción del Producto y Modelo de Negocio

    ### 2.1 Enfoque B2B y Multi-tenencia
    La plataforma está construida bajo un modelo **B2B (Business-to-Business)**, soportando:
    - **SaaS Multi-tenancy**: Separación lógica de datos por cliente (tenant_id).
    - **SSO Enterprise**: Integración con proveedores de identidad corporativos (SAML/Sso).
    - **Portal de Cliente**: Panel dedicado para que los responsables de formación (Managers/C-Level) gestionen a sus propios empleados.

    ### 2.2 Roles y Permisos

    | Rol | Descripción | Acceso Principal |
    |-----|-------------|------------------|
    | **Super Admin** | Control total de la plataforma y del catálogo global. | `/admin` |
    | **Inspector** | Perfil de auditoría para monitorizar el cumplimiento académico y normativo. | `/admin/inspector` |
    | **Manager / C-Level** | Responsable de formación en una empresa cliente (B2B). | `/portal-cliente` |
    | **Instructor / Tutor** | Experto en la materia que guía y evalúa a los alumnos. | `/tutor` |
    | **Student (Alumno)** | Usuario final que consume el contenido y progresa. | `/dashboard` |

    ---

    ## 3. Funcionalidades del MVP (Estado Actual)

    ### 3.1 Gestión de Aprendizaje (LMS Core)
    - **Jerarquía de Contenido**: Estructura de 3 niveles: **Módulo > Unidad > Contenido**.
    - **Course Editor 2.0**: Panel administrativo con **Drag & Drop** para reordenar contenidos y moverlos entre unidades en tiempo real.
    - **Gestión de Cohortes**: Creación y seguimiento de grupos de alumnos con fechas de inicio/fin.

    ### 3.2 AI Content Studio
    - **AI Generator**: Creación de material educativo (Audio/Video/Texto) a partir de prompts.
    - **Media Hosting**: Almacenamiento optimizado de archivos multimedia en Supabase Storage.
    - **Etiquetado IA**: Identificación visual de contenidos generados por inteligencia artificial.

    ### 3.3 Portal B2B y Reporting
    - **Dashboard de Cliente**: Visualización de KPIs de progreso, horas logradas y tasas de finalización de empleados.
    - **Monitorización de Inspector (Fundae)**: Seguimiento de alumnos "En Riesgo" y cumplimiento de asistencia.
    - **Sistema de Importación**: Carga masiva de usuarios y matrículas mediante procesamiento de archivos CSV (Import Jobs).

    ### 3.4 Gamificación y Social
    - **Motor de Gamificación**: Sistema de **XP (Experiencia)**, **Niveles** y **Leaderboards**.
    - **Comunidad**: Espacios de interacción social y foros por curso.
    - **Profile**: Gestión de perfil de usuario con visualización de logros.

    ### 3.5 Cumplimiento Normativo (FUNDAE)
    - **Control de Asistencia**: Registro detallado de actividad para bonificaciones de formación.
    - **Expedientes Digitales**: Generación de informes de cumplimiento para inspecciones.

    ---

    ## 4. Requisitos Técnicos e Infraestructura

    ### 4.1 Arquitectura de Microservicios (Hono.js)
    - `iam-service`: Autenticación, roles y gestión de sesiones.
    - `tenant-service`: Control de organizaciones y configuraciones SSO.
    - `catalog-service`: Motor de cursos y jerarquía de contenidos.
    - `enrollment-service`: Gestión de inscripciones y cohortes.
    - `progress-service`: Seguimiento granular de avance por lección.
    - `fundae-service`: Lógica de cumplimiento y auditoría corporativa.
    - `gamification-service`: Reglas de negocio para XP y rankings.

    ### 4.2 Stack Tecnológico
    - **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons, DnD-Kit.
    - **Base de Datos**: PostgreSQL vía Supabase.
    - **Autenticación**: JWT con soporte para Mock y SSO real.

    ---

    ## 5. Roadmap de Futuras Iteraciones

    ### Fase 2: Automatización Administrativa
    - **Certificados Automáticos**: Generación de diplomas PDF con firma digital al completar cursos.
    - **Mejora de Tutoría**: Sistema de tickets y feedback directo en el video player.

    ### Fase 3: E-Commerce y Expansión
    - **Marketplace**: Pasarela de pagos (Stripe) para venta de cursos a usuarios finales (B2C) o empresas pequeñas.
    - **LTI Integration**: Soporte para consumir contenidos desde otros LMS externos.

    ### Fase 4: IA Avanzada
    - **AI Tutor Personalizado**: Chatbot que conoce el contenido del curso y asiste al alumno en tiempo real.
    - **Análisis de Sentimiento**: Detección de frustración en alumnos mediante sus comentarios.

    ---

    ## 6. Riesgos y Mitigaciones
    - **Cumplimiento Legal**: Cambios en la normativa de FUNDAE.
    - *Mitigación*: Servicio de auditoría desacoplado (`fundae-service`) para cambios rápidos.
    - **Escalabilidad Multimedia**: Alto consumo de ancho de banda por videos generados.
    - *Mitigación*: Implementación de CDN y optimización de bitrate.
