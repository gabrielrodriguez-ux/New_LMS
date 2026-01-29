# Backlog | ThePower LMS Multi-tenant

## Épicas

| ID | Épica | Superficie | Prioridad |
|----|-------|------------|-----------|
| E1 | Infraestructura Multi-tenant | Transversal | P0 |
| E2 | IAM y SSO | Portal Cliente | P0 |
| E3 | Catálogo y Course Builder | Admin Contenido | P0 |
| E4 | LMS/LPX Core (Alumno) | LMS/LPX | P0 |
| E5 | Gamificación | LMS/LPX | P1 |
| E6 | FUNDAE Compliance | Admin + Portal | P1 |
| E7 | Docente Experience | LMS/LPX | P1 |
| E8 | Portal Cliente Config | Portal Cliente | P1 |
| E9 | Interoperabilidad | Transversal | P2 |
| E10 | Analytics y Reporting | Admin + Portal | P2 |

---

## E1: Infraestructura Multi-tenant

### E1-S1: Tenant Service Core
**Como** Platform Admin  
**Quiero** crear y gestionar tenants  
**Para** aislar datos y configuración por cliente

**Criterios de Aceptación:**
- [ ] POST /tenants crea tenant con id, name, slug, cif
- [ ] Todas las tablas incluyen `tenant_id` como FK
- [ ] RLS activo en PostgreSQL por tenant_id
- [ ] Tests de aislamiento: query de tenant A no retorna datos de tenant B
- [ ] Audit log registra creación con actor y timestamp

### E1-S2: Branding por Tenant
**Como** Tenant Admin  
**Quiero** configurar branding (logo, colores, dominio)  
**Para** ofrecer experiencia white-label

**Criterios de Aceptación:**
- [ ] PUT /tenants/{id}/settings actualiza branding
- [ ] Logo se sube a S3 con path `/{tenant_id}/branding/`
- [ ] Colores se aplican dinámicamente en CSS vars
- [ ] Subdominio/dominio personalizado configurable

### E1-S3: Feature Flags por Plan
**Como** Platform Admin  
**Quiero** activar/desactivar features por tenant  
**Para** segmentar por plan comercial

**Criterios de Aceptación:**
- [ ] JSONB `feature_flags` en tabla tenants
- [ ] API GET/PUT para gestión de flags
- [ ] Middleware valida feature antes de endpoints protegidos
- [ ] Flags: `leaderboard`, `challenges`, `hris_sync`, `fundae`, `advanced_exports`

---

## E2: IAM y SSO

### E2-S1: Gestión de Usuarios
**Como** Tenant Admin  
**Quiero** crear, listar y desactivar usuarios  
**Para** gestionar mi base de alumnos

**Criterios de Aceptación:**
- [ ] POST /users/import acepta CSV/Excel (10k+ filas)
- [ ] Validación de duplicados por email y DNI
- [ ] Desactivación con audit trail (quién, cuándo, razón)
- [ ] GET /users con paginación cursor-based y filtros

### E2-S2: RBAC
**Como** Tenant Admin  
**Quiero** asignar roles predefinidos a usuarios  
**Para** controlar permisos por función

**Criterios de Aceptación:**
- [ ] Roles: Alumno, Manager, Docente, L&D Manager, Admin, C-Level
- [ ] PUT /users/{id}/roles asigna roles
- [ ] Evaluación de permisos <10ms
- [ ] Sin over-permissions (principio mínimo privilegio)

### E2-S3: SSO (SAML/OAuth2)
**Como** Tenant Admin  
**Quiero** configurar SSO con mi IdP  
**Para** unificar autenticación

**Criterios de Aceptación:**
- [ ] POST /tenants/{id}/sso/config soporta SAML 2.0, OAuth2
- [ ] Providers: Azure AD, Google Workspace, Okta, SAML genérico
- [ ] Auto-provisioning al primer login
- [ ] Sync de atributos (nombre, departamento)
- [ ] Logout centralizado

---

## E3: Catálogo y Course Builder

### E3-S1: CRUD de Cursos
**Como** L&D Manager  
**Quiero** crear y editar cursos  
**Para** gestionar el catálogo

**Criterios de Aceptación:**
- [ ] POST/PUT /courses con title, description, hours, level
- [ ] Estados: draft, published, archived
- [ ] Versionado automático en cada publicación
- [ ] Campo `fundae_compatible` para marcar compatibilidad

### E3-S2: Builder de Módulos No-Code
**Como** L&D Manager  
**Quiero** agregar módulos con drag&drop  
**Para** crear cursos sin código

**Criterios de Aceptación:**
- [ ] POST /courses/{id}/modules con tipos: video, PDF, texto, quiz, SCORM
- [ ] Reordenamiento por `order_index`
- [ ] Módulos marcables como `mandatory`
- [ ] Upload multimedia con transcodificación
- [ ] CDN video con buffering <2s

### E3-S3: SCORM Import
**Como** L&D Manager  
**Quiero** importar paquetes SCORM 1.2/2004  
**Para** reutilizar contenido existente

**Criterios de Aceptación:**
- [ ] Upload de ZIP SCORM
- [ ] Parsing de imsmanifest.xml
- [ ] Runtime player integrado
- [ ] Tracking de cmi.* variables

---

## E4: LMS/LPX Core (Alumno)

### E4-S1: Dashboard Alumno
**Como** Alumno  
**Quiero** ver mi dashboard personalizado  
**Para** continuar mi aprendizaje

**Criterios de Aceptación:**
- [ ] "Mis próximos" cursos asignados
- [ ] Progreso visual por curso (%)
- [ ] Notificaciones recientes
- [ ] Carga <2s, responsive, WCAG 2.1 AA

### E4-S2: Vista de Curso y Player
**Como** Alumno  
**Quiero** consumir contenido multimedia  
**Para** aprender

**Criterios de Aceptación:**
- [ ] Player video/PDF/texto integrado
- [ ] Sidebar con syllabus y progreso por módulo
- [ ] Tracking de tiempo real
- [ ] Tabs: Notas, Transcript, Recursos, Discusión

### E4-S3: Quizzes y Evaluación
**Como** Alumno  
**Quiero** realizar quizzes  
**Para** validar mi conocimiento

**Criterios de Aceptación:**
- [ ] Tipos: múltiple choice, verdadero/falso
- [ ] Feedback inmediato con score
- [ ] Intentos configurables
- [ ] Evento `Assessment.Graded` publicado

### E4-S4: Certificados
**Como** Alumno  
**Quiero** recibir certificado al completar  
**Para** demostrar mi logro

**Criterios de Aceptación:**
- [ ] Emisión automática al completar módulos obligatorios
- [ ] Plantilla personalizable por tenant
- [ ] URL de verificación pública
- [ ] Descargable PDF

---

## E5: Gamificación

### E5-S1: Sistema XP
**Como** Alumno  
**Quiero** ganar XP por acciones  
**Para** sentir progreso

**Criterios de Aceptación:**
- [ ] XP por: completar módulo, pasar quiz, streak diario, challenge
- [ ] Notificación inmediata "+X XP"
- [ ] Historial visible en perfil
- [ ] Multiplicadores configurables por tenant

### E5-S2: Sistema de Niveles
**Como** Alumno  
**Quiero** subir de nivel  
**Para** ver mi progreso acumulado

**Criterios de Aceptación:**
- [ ] 50 niveles con XP progresivo
- [ ] Animación de level-up
- [ ] Opción de mutear sonidos
- [ ] Evento `Level.Up` publicado

### E5-S3: Badges
**Como** Alumno  
**Quiero** ganar badges por logros  
**Para** coleccionar reconocimientos

**Criterios de Aceptación:**
- [ ] Mínimo 30 badges definidos
- [ ] Reglas claras (criteria JSONB)
- [ ] Notificación inmediata
- [ ] Shareable (imagen + texto)

### E5-S4: Leaderboards
**Como** Alumno  
**Quiero** ver rankings  
**Para** competir sanamente

**Criterios de Aceptación:**
- [ ] Scopes: global, departamento, equipo, curso, challenge
- [ ] Real-time (delay máx 10s)
- [ ] Opt-out "ocultar mi score"
- [ ] Anti-cheat: límites XP diarios

### E5-S5: Weekly Challenges
**Como** Alumno  
**Quiero** participar en challenges  
**Para** ganar XP bonus

**Criterios de Aceptación:**
- [ ] CRUD challenges con fechas y criterios
- [ ] Leaderboard del challenge
- [ ] Reward XP automático al completar
- [ ] POST /challenges/{id}/complete valida criterios

---

## E6: FUNDAE Compliance

### E6-S1: Generación de Expedientes
**Como** L&D Manager  
**Quiero** generar expedientes FUNDAE  
**Para** solicitar bonificación

**Criterios de Aceptación:**
- [ ] POST /fundae/expedients/generate con curso, participantes, docente
- [ ] Incluye: empresa (CIF, nombre, sector), curso (horas, nivel), alumnos (DNI)
- [ ] Genera PDF y XML compatibles FUNDAE 2.0
- [ ] Almacenamiento versionado

### E6-S2: Validación en Tiempo Real
**Como** L&D Manager  
**Quiero** validar compliance antes de enviar  
**Para** evitar rechazos

**Criterios de Aceptación:**
- [ ] POST /fundae/expedients/{id}/validate
- [ ] Reglas: asistencia ≥75%, docente calificado, horas ≥6
- [ ] Score 0-100 + lista de errores con campos
- [ ] Alertas previas a incumplimientos

### E6-S3: Tracking de Asistencia
**Como** Sistema  
**Quiero** registrar asistencia automáticamente  
**Para** cumplir 75% FUNDAE

**Criterios de Aceptación:**
- [ ] Métodos: acceso plataforma, QR presencial, biométrico
- [ ] POST /fundae/attendance/record
- [ ] Cálculo automático de porcentaje
- [ ] Excepción "IT issues" validada por docente
- [ ] Evento `Attendance.BelowThreshold` si <75%

### E6-S4: Gestión de Docentes
**Como** L&D Manager  
**Quiero** registrar cualificaciones docentes  
**Para** cumplir requisitos FUNDAE

**Criterios de Aceptación:**
- [ ] CRUD certificaciones con vigencia
- [ ] Asignación por especialidad/familia profesional
- [ ] Alertas de expiración
- [ ] Histórico de docencia auditable

### E6-S5: Reporting FUNDAE
**Como** L&D Manager  
**Quiero** exportar reportes firmados  
**Para** auditoría

**Criterios de Aceptación:**
- [ ] GET /fundae/reports/export?format=pdf|excel|xml
- [ ] Reportes: expediente, certificados, horas, no conformidades
- [ ] Firma digital en PDFs críticos
- [ ] Trazabilidad de accesos a reportes

---

## E7: Docente Experience

### E7-S1: Dashboard Docente
**Como** Docente  
**Quiero** ver mis cursos y alumnos  
**Para** gestionar mi docencia

**Criterios de Aceptación:**
- [ ] Lista de cursos asignados
- [ ] Progreso de alumnos por curso
- [ ] Alertas de bajo rendimiento

### E7-S2: Gestión de Incidencias
**Como** Docente  
**Quiero** aprobar excepciones de asistencia  
**Para** cubrir IT issues FUNDAE

**Criterios de Aceptación:**
- [ ] Ver solicitudes de excepción
- [ ] Aprobar/rechazar con comentario
- [ ] Audit trail de decisiones

---

## E8: Portal Cliente Config

### E8-S1: Dashboard Admin
**Como** Tenant Admin  
**Quiero** ver métricas clave  
**Para** monitorear adopción

**Criterios de Aceptación:**
- [ ] Cursos asignados vs completados
- [ ] Horas acumuladas, tiempo promedio
- [ ] Usuarios at-risk (sin actividad)
- [ ] Export PDF/Excel

### E8-S2: Configuración de Notificaciones
**Como** Tenant Admin  
**Quiero** configurar notificaciones  
**Para** no saturar usuarios

**Criterios de Aceptación:**
- [ ] Quiet hours configurables
- [ ] Cap semanal de notificaciones
- [ ] Canales: email, Slack, Teams
- [ ] Templates personalizables

### E8-S3: Configuración de Gamificación
**Como** Tenant Admin  
**Quiero** ajustar reglas de gamificación  
**Para** adaptarlas a mi cultura

**Criterios de Aceptación:**
- [ ] Activar/desactivar leaderboard
- [ ] Configurar scopes permitidos
- [ ] Ajustar reglas XP
- [ ] Límites anti-abuse

---

## E9: Interoperabilidad

### E9-S1: LTI 1.3 Integration
**Como** Tenant Admin  
**Quiero** integrar con Moodle u otro LMS  
**Para** federar contenido

**Criterios de Aceptación:**
- [ ] LTI 1.3 Tool Provider
- [ ] LTI 1.3 Tool Consumer
- [ ] Deep linking
- [ ] Grade passback

### E9-S2: xAPI/LRS
**Como** Sistema  
**Quiero** enviar statements xAPI  
**Para** tracking avanzado

**Criterios de Aceptación:**
- [ ] LRS interno (xapi-lrs-service)
- [ ] Statements por completion, score, duration
- [ ] Query endpoint para reporting

### E9-S3: HRIS/ATS Sync
**Como** Tenant Admin  
**Quiero** sincronizar usuarios con HRIS  
**Para** automatizar onboarding

**Criterios de Aceptación:**
- [ ] Conectores: Workday, SAP SuccessFactors, ADP
- [ ] Sync vía API o SFTP
- [ ] Mapeo de atributos configurable
- [ ] Auto-assign onboarding por ATS

---

## E10: Analytics y Reporting

### E10-S1: Dashboards BI
**Como** C-Level  
**Quiero** dashboards ejecutivos  
**Para** decisiones estratégicas

**Criterios de Aceptación:**
- [ ] Métricas agregadas por departamento, curso, tiempo
- [ ] Filtros interactivos
- [ ] Export a PDF/Excel

### E10-S2: Audit Trail
**Como** Compliance Officer  
**Quiero** ver logs de auditoría  
**Para** cumplir normativas

**Criterios de Aceptación:**
- [ ] GET /audit/logs con filtros
- [ ] Registra: SSO, roles, cursos, expedientes, exports
- [ ] Inmutable (append-only)
- [ ] Retención configurable

---

## Open Questions / Gaps

> [!WARNING]  
> Estos puntos requieren clarificación antes de implementar:

1. **Estrategia multi-tenant:** ¿DB por tenant (enterprise) o shared con tenant_id (SMB)?
2. **FUNDAE envío:** ¿Solo generación/export o integración con sistema FUNDAE externo?
3. **Familia profesional:** ¿De dónde se obtiene catálogo oficial? ¿API SEPE?
4. **Social features:** ¿Comentarios, foros, mentoring dentro de scope o fuera?
5. **Integración LMS externos:** Además de LTI, ¿se requiere API específica para Moodle?
