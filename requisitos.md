Perfecto: querés un documento de requisitos “para IA implementadora” (sin hablar de tiempos), y con la visión clara de que la plataforma son 3 superficies:
	1.	LMS/LPX (Alumno + Docente)
	2.	Admin de Contenido (operación interna / L&D)
	3.	Portal Cliente (configuración por tenant + integraciones)

Prioridades: facilidad de uso, gamificación, interoperabilidad, setup de nuevos clientes, y Fundae. Todo eso está alineado con el PRD consolidado v2.0  ￼.

Abajo tenés el doc listo para copiar/pegar.

⸻

Documento de Requisitos Detallado (Build Spec)

ThePower Education | Plataforma LMS/LPX B2B + Admin + Portal Cliente

Fuente: PRD consolidado v2.0  ￼
Objetivo: Construir una plataforma B2B multi-tenant con FUNDAE compliance automatizado (diferenciador), UX premium + gamificación profunda, y operabilidad empresarial con integraciones corporativas.

⸻

0) Instrucciones al agente de desarrollo (IA)
	1.	No inventar funcionalidades fuera de este documento. Si algo falta, agregarlo a “Open Questions / Gaps”.
	2.	Todo debe ser multi-tenant: aislamiento de datos, configuración, branding, integraciones y logs.
	3.	Todo lo relevante debe ser auditable: quién hizo qué, cuándo, antes/después.
	4.	Entregar como salida: arquitectura, modelo de datos, APIs (OpenAPI), backlog (épicas/stories), y criterios de aceptación ejecutables.

⸻

1) Principios no negociables (prioridades de producto)
	1.	Usabilidad primero: “zero learning curve”, mobile-first, accesible WCAG 2.1 AA.
	2.	Gamificación core en LMS/LPX: XP, niveles, badges, leaderboards, challenges con reglas claras y feedback inmediato.
	3.	Interoperabilidad real: SCORM 1.2/2004, LTI 1.3, xAPI, API robusta con OpenAPI + SDK.
	4.	Setup y escalabilidad B2B: SSO, RBAC, bulk import, integración HRIS/ATS, configuración por cliente.
	5.	FUNDAE compliance automatizado: expedientes, validación, asistencia, auditoría, reporting firmado.

⸻

2) Superficies del producto

A) LMS/LPX (Alumno + Docente)
	•	Experiencia de aprendizaje (catálogo, curso, progreso)
	•	Experiencia social ligera (comentarios/ayuda si aplica)
	•	Gamificación (visible, inmediata, motivadora)

B) Admin de Contenido (L&D / Operaciones)
	•	Builder no-code, librería de módulos, plantillas
	•	Publicación, versionado, compatibilidad FUNDAE
	•	Gestión de docentes/cualificaciones
	•	Reporting interno y para clientes

C) Portal Cliente (Tenant Admin)
	•	Configuración (branding, roles, gamificación, notificaciones)
	•	Identidad (SSO), usuarios (sync/import), integraciones
	•	Dashboards (progreso, FUNDAE, adopción)
	•	Exportaciones (Excel/PDF/XML), auditoría de accesos

⸻

3) Roles (RBAC) y permisos base

Roles predefinidos (mínimo): Alumno, Manager, Docente, L&D Manager, Admin, C-Level.  ￼
Criterios:
	•	Evaluación permisos < 10ms  ￼
	•	Sin “over-permissions” + audit trail completo  ￼

⸻

4) Multi-tenant y configuración por cliente (Portal Cliente)

REQ-T-001 Aislamiento de tenant (obligatorio)
	•	Cada entidad persistida incluye tenant_id.
	•	Aislamiento de: datos, ficheros, colas/jobs, logs, métricas, integraciones.

REQ-T-002 Branding / white-label mínimo
	•	Logo, colores, nombre comercial, dominio/subdominio, plantillas de email, certificados.

REQ-T-003 Feature flags por plan
	•	Activar/desactivar módulos por cliente (ej.: leaderboard, challenges, HRIS sync, exports avanzados).

REQ-T-004 Configuración gamificación por tenant
	•	Activar leaderboard, scopes (global/departamento/equipo), opt-out, reglas XP, límites y anti-cheat.

REQ-T-005 Configuración notificaciones por tenant
	•	Quiet hours, cap semanal, canales (email/Slack/Teams), plantillas.

⸻

5) Interoperabilidad e integraciones (CRITICAL)

REQ-I-001 Estándares de contenido
	•	SCORM 1.2 y soporte LTI 1.3
	•	xAPI (LRS) para tracking avanzado  ￼

REQ-I-002 Identidad: SSO
	•	SAML 2.0 / OAuth2; soportar Azure AD, Google Workspace, Okta, SAML genérico.
	•	Auto-provisioning al primer login; sync atributos; logout centralizado; MFA opcional.

REQ-I-003 HRIS/ATS/Slack/Teams
	•	HRIS (Workday, SAP SuccessFactors, ADP) vía API/SFTP para sync usuarios/atributos; ATS para auto-assign onboarding; Slack/Teams para notificaciones y reminders.

REQ-I-004 API pública robusta
	•	OpenAPI 3.0 + versionado + rate limiting + OAuth2.
	•	SDK mínimo: Python, Node.js, Java.
	•	Uptime API 99.9%.

⸻

6) FUNDAE Compliance (CRITICAL)

REQ-F-001 Generación automática de expedientes FUNDAE
	•	Inputs: empresa (CIF, nombre, sector), curso (nombre/horas/nivel/contenidos), participantes (DNI), docente (cualificación/especialidad).  ￼
	•	Proceso: validación automática reglas FUNDAE + generación PDF/XML + repositorio versionado + auditoría completa.  ￼
	•	Output: expediente compatible FUNDAE 2.0.  ￼

REQ-F-002 Validación en tiempo real de cumplimiento

Reglas mínimas: asistencia 75%, docente calificado, horas > 6, contenido alineado a familia profesional, nómina completa, firmas presentes.
	•	Score 0-100 visible en dashboard + alertas previas a incumplimientos + export PDF/Excel.

REQ-F-003 Tracking automático de asistencia (75% mínimo)

Métodos: acceso plataforma, QR (presencial), biométrico opcional, engagement mínimo.
	•	Permitir excepción por “IT issues” validada por docente.  ￼

REQ-F-004 Docentes y cualificaciones
	•	Registro certificaciones, vigencias, reglas de asignación por especialidad, histórico de docencia.

REQ-F-005 Reporting y auditoría FUNDAE

Reportes: expediente completo, certificados, horas por familia profesional, no conformidades, comparativo gasto vs bonificación.  ￼
	•	Trazabilidad de accesos + firmas digitales en reportes críticos.  ￼

⸻

7) LMS/LPX: Requisitos funcionales (Alumno + Docente)

7.1 Dashboard Alumno

Componentes mínimos: “Mis próximos”, progreso visual, notificaciones, gamification display (nivel/XP/badges/ranking), histórico completados, recomendaciones (si aplica).
Criterios UX: carga <2s, responsive, touch-friendly, WCAG.

7.2 Vista de Curso (Alumno)
	•	Player de contenido (video/pdf/texto) + quizzes + progreso por módulo.
	•	Feedback inmediato: “quiz passed +XP”, confetti opcional, progresos animados.
	•	Reglas de completion (por módulos obligatorios) + tracking de tiempo.

7.3 Experiencia Docente
	•	Crear/editar cursos (según permisos), ver progreso alumnos, gestionar incidencias de asistencia (FUNDAE IT issues), evaluaciones y feedback.

7.4 Certificados
	•	Emisión automática al completar, plantilla por tenant, URL descargable y auditable. (Conexión con reporting FUNDAE si corresponde).  ￼

⸻

8) Gamificación (CRITICAL en LMS/LPX)

REQ-G-001 XP System (transparente)
	•	XP visible en dashboard, en curso (inline) y perfil con historial y desglose.
	•	Notificación inmediata de XP + multiplicadores correctos.

REQ-G-002 Levels
	•	Estructura de niveles (el PRD define una estructura de 50 niveles con feedback visual).
	•	Level-up con animación suave y opción de mutear sonidos.  ￼

REQ-G-003 Badges & Achievements
	•	Mínimo 30 badges, reglas claras, notificación inmediata, shareable.

REQ-G-004 Leaderboards
	•	Tipos: global, departamental, team (manager-only), por curso, por challenge, mensuales.
	•	Real-time (delay máx. 10s) + mobile-friendly.
	•	Anti-toxicity: opt-out “hide my score”, fairness, anti-cheat.

REQ-G-005 Challenges & Quests
	•	Weekly challenge + bonus; leaderboard del challenge; rewards XP.

⸻

9) Admin de Contenido (operación interna / L&D)

REQ-A-001 Course Builder no-code
	•	WYSIWYG drag&drop; tipos: video, PDF, texto, quiz, SCORM; plantillas (onboarding/compliance/skills); módulos reutilizables; multimedia con transcodificación.
	•	Cursos “FUNDAE compatibles automáticamente”.  ￼
	•	CDN video con buffering <2s.

REQ-A-002 Publicación y versionado
	•	Estados: draft/published; versionado de curso; historial de cambios auditable.
	•	Compatibilidad: cuando cambia un curso, mantener integridad de cohorts/expedientes FUNDAE asociados (no romper auditoría).

REQ-A-003 Gestión de docentes
	•	Certificaciones, vigencia, asignación por especialidad, alertas expiración.  ￼

⸻

10) Portal Cliente (Tenant Admin) y operabilidad

REQ-P-001 Gestión de usuarios
	•	Bulk import CSV/Excel (10k+), validación duplicates por email/DNI, sync configurable, deactivación automática con auditoría.

REQ-P-002 Asignación flexible
	•	Manual, por criterio, automático por skill gap (si aplica), import masivo, auto-enroll; notificación inmediata; deadline y recordatorios.

REQ-P-003 Dashboard progreso (Admin/Manager/C-Level)
	•	Cursos asignados vs completados, horas acumuladas, tiempo promedio, at-risk, export PDF/Excel, filtros por curso/usuario/equipo/fecha/status.

REQ-P-004 FUNDAE Console
	•	Estado de expedientes, score compliance, no conformidades, attendance, exports PDF/Excel/XML firmados, trazabilidad de acceso.

REQ-P-005 Integraciones UI
	•	Setup SSO, setup HRIS/ATS/Slack/Teams, mapeo de atributos, health/status de sync, retry y logs por tenant.

⸻

11) Auditoría, seguridad y cumplimiento (transversal)

REQ-S-001 Audit Trail universal
	•	Registrar acciones admin y cambios críticos (SSO, roles, cursos, expedientes FUNDAE, exports).

REQ-S-002 Compliance & certificaciones objetivo
	•	GDPR/RGPD; estándares SCORM/LTI/xAPI; objetivo SOC2/ISO.

REQ-S-003 Performance y escalabilidad
	•	Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1; API p95 <200ms.
	•	Escala: 100k+ usuarios simultáneos, 1k req/s, autoscaling.

⸻

12) APIs mínimas (contratos)

Basado en requerimiento de API robusta + endpoints críticos.

Tenant & Config
	•	GET/PUT /tenants/{tenantId}/settings
	•	POST /tenants/{tenantId}/sso/config
	•	GET /audit/logs?tenantId=...

Users
	•	POST /users/import
	•	GET /users
	•	PUT /users/{id}/roles
	•	POST /users/deactivate

Courses
	•	POST /courses
	•	PUT /courses/{id}
	•	POST /courses/{id}/publish
	•	POST /courses/{id}/modules

Enrollments
	•	POST /enrollments/assign (bulk)
	•	GET /enrollments

Progress
	•	GET /progress
	•	POST /progress/events (xAPI-friendly si aplica)

Certificates
	•	POST /certificates/issue
	•	GET /certificates/{id}

Gamification
	•	GET /gamification/profile
	•	GET /leaderboards
	•	POST /challenges/{id}/complete

FUNDAE
	•	POST /fundae/expedients/generate
	•	POST /fundae/expedients/{id}/validate
	•	POST /fundae/attendance/record
	•	GET /fundae/reports/export?format=pdf|excel|xml

⸻

13) Modelo de eventos (recomendado para interoperabilidad)
	•	user.created|updated|deactivated
	•	course.published|versioned
	•	enrollment.assigned|completed|expired
	•	progress.updated
	•	certificate.issued
	•	xp.awarded|level.up|badge.earned|challenge.completed
	•	fundae.expedient.generated|compliance.changed|attendance.below_threshold|report.exported

⸻

14) Requisitos no funcionales (NFRs)
	•	Accesibilidad WCAG 2.1 AA; compatibilidad navegadores; mobile; idiomas 11+; RTL; light/dark.
	•	Uptime 99.9% + backups + DR (RTO/RPO definidos en PRD).
	•	Observabilidad: monitoring y alertas.

⸻

15) Open Questions / Gaps (para no adivinar)
	1.	¿Estrategia multi-tenant: DB por tenant o shared con tenant_id?
	2.	FUNDAE: ¿solo generación/export o hay “envío” a un sistema externo? (no queda explícito en el extracto).  ￼
	3.	¿Catálogo oficial de “familia profesional” y reglas de alineación: de dónde salen y cómo se mantienen?  ￼
	4.	¿Qué partes exactas del LMS/LPX son “social” (comentarios, foros, mentoring) vs fuera de alcance?

⸻