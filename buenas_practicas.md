---
title: "Buenas prácticas para un LMS en microservicios ultra desacoplados"
version: "2.0"
owner: "Equipo de Plataforma"
last_updated: "2026-01-26"
architecture_style: "microservices"
coupling_goal: "ultra-decoupled"
---

# Guía de Arquitectura LMS Microservicios Ultra Desacoplados

## Resumen Ejecutivo

Esta guía define la arquitectura obligatoria, decisiones clave y "no negociables" para un LMS en microservicios ultra desacoplados:

| Aspecto | Decisión |
|---------|----------|
| **Arquitectura** | Microservicios con database-per-service y límites claros de dominio |
| **Comunicación** | Event-driven (pub/sub) + sync solo para auth y queries críticas |
| **Contratos** | OpenAPI/AsyncAPI + Consumer-Driven Contracts (CDC) + versionado formal |
| **Integraciones** | Adapters por capability (pagos, proctoring, video, CRM) sin SDKs en core |
| **Multi-tenancy** | Tiering (shared vs dedicated) + quotas + aislamiento de recursos |
| **Consistencia** | Eventual + sagas + outbox/inbox + idempotencia obligatoria |
| **Observabilidad** | OpenTelemetry E2E + correlation/causation IDs + logs estructurados |
| **Seguridad** | Zero trust + authN/authZ S2S + mTLS (mesh opcional) + secretos en vault |
| **Delivery** | CI/CD independiente por servicio + feature flags + canary/blue-green |
| **Gobernanza** | ADRs + service catalog + ownership + golden path |

### Tres Riesgos Principales y Mitigación

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **Cascadas de fallos distribuidos** | Caída parcial/total por dependencia en cadena | Timeouts + circuit breakers + bulkheads, límites de fan-out sync, degradación controlada, DLQ y reintentos con backoff |
| **Complejidad operacional** | Debug lento, incidentes largos, burnout | Observabilidad E2E, runbooks, SLOs + error budgets, plataforma interna ("golden path"), on-call con disciplina |
| **Acoplamiento oculto vía eventos** | Consumers rotos silenciosamente | Envelope estándar + schema registry, CDC, dual publish (v1+v2), políticas de deprecación explícitas |

---

## 1. Arquitectura de Servicios y Dominios

### Principios Fundacionales

1. **Alta cohesión por capability:** un servicio existe si reduce acoplamiento y tiene ownership claro.
2. **Database-per-service:** no joins cross-service, no foreign keys entre servicios.
3. **Contratos versionados:** APIs y eventos son contratos; el runtime es secundario.
4. **Async-first:** eventos de dominio para cambios de estado; sync solo para lectura crítica o auth.
5. **Evitar "shared business logic":** librerías compartidas solo para concerns técnicos (telemetría, auth client, logging), nunca reglas de negocio.

### Antipatrones a Evitar

- ❌ Servicios que comparten DB "por performance"
- ❌ "God services" (notifications consumiendo todo, integration gateway monolítico)
- ❌ Shared libraries con reglas de negocio
- ❌ Llamadas sync en cascada (A→B→C→D)
- ❌ Microservicios por capas técnicas (api-service, data-service…)

### Checklist de Diseño

- [ ] Cada servicio tiene límites de dominio claros (2 frases máximo)
- [ ] No existen dependencias de compilación con lógica de negocio compartida
- [ ] Comunicación cross-domain por eventos, no por llamadas sync recurrentes
- [ ] Los cambios de un servicio **no obligan** a desplegar otros (salvo coordinación de contratos)
- [ ] Existe README por servicio (responsabilidades, APIs, eventos, ownership, SLO)

### Microservicios Propuestos (Tabla Unificada)

| Servicio | Responsabilidad | DB | APIs | Eventos Publicados | Eventos Consumidos |
|---|---|---|---|---|---|
| **iam-service** | Identidad, authN, usuarios, sesiones, federación SSO | PostgreSQL | REST/gRPC interno | `Identity.UserCreated`, `Identity.UserUpdated` | — |
| **tenant-service** | Tenants, marcas, dominios, feature flags, quotas | PostgreSQL | REST | `Tenant.TenantCreated`, `Tenant.QuotaUpdated` | — |
| **catalog-service** | Catálogo de cursos, programas, versiones, metadata | PostgreSQL | REST | `Catalog.CoursePublished`, `Catalog.CourseArchived` | — |
| **enrollment-service** | Inscripción, cohorts, elegibilidad, acceso lógico | PostgreSQL | REST | `Enrollment.StudentEnrolled`, `Enrollment.EnrollmentCancelled` | `Billing.PaymentConfirmed`, `Catalog.CoursePublished` |
| **learning-access-service** | Provisión de acceso (entitlements), gating, permisos | PostgreSQL | REST | `LearningAccess.AccessGranted`, `LearningAccess.AccessRevoked` | `Enrollment.StudentEnrolled`, `Enrollment.EnrollmentCancelled` |
| **assessment-service** | Exámenes/quizzes, intentos, submissions | PostgreSQL | REST | `Assessment.Submitted`, `Assessment.Graded` | `Enrollment.StudentEnrolled` |
| **progress-service** | Progreso, milestones, completitud | TimescaleDB/PostgreSQL | REST | `Progress.CourseCompleted`, `Progress.MilestoneReached` | `Telemetry.ContentCompleted`, `Assessment.Graded`, `LearningAccess.AccessGranted` |
| **certification-service** | Certificados, badges, verificación pública | PostgreSQL | REST | `Certification.CertificateIssued` | `Progress.CourseCompleted` |
| **billing-service** | Suscripciones, facturación, invoices, estado de cuenta | PostgreSQL | REST | `Billing.PaymentInitiated`, `Billing.PaymentConfirmed`, `Billing.RefundProcessed` | — |
| **payment-adapter-stripe** | Integración Stripe (API + webhooks) | — | REST webhook | `Billing.PaymentConfirmed` (normalizado) | — |
| **payment-adapter-paypal** | Integración PayPal (API + webhooks) | — | REST webhook | `Billing.PaymentConfirmed` (normalizado) | — |
| **notification-service** | Orquestación de notificaciones (templates, preferencias) | PostgreSQL/Redis | REST | `Notification.Sent` | **Whitelist**: `Enrollment.StudentEnrolled`, `Billing.PaymentConfirmed`, `Progress.CourseCompleted`, `Certification.CertificateIssued` |
| **telemetry-lrs-service** | Tracking de aprendizaje (xAPI/LRS), consumo, learning records | DynamoDB/PostgreSQL | REST ingest | `Telemetry.ContentAccessed`, `Telemetry.ContentCompleted` | `LearningAccess.AccessGranted` |
| **analytics-service** | DW/BI, métricas agregadas, dashboards | ClickHouse/BigQuery | REST | — | **Whitelist amplia** (eventos de negocio sanitizados) |
| **search-service** | Indexación y búsqueda cross-domain | Elastic/Typesense | REST | — | `Catalog.*` (opcional) |
| **proctoring-adapter-{vendor}** | Sesiones proctoring, webhooks, flags | — | REST webhook | `Proctoring.FlagRaised` | `Assessment.AttemptStarted` |

**Cambios clave aplicados:**
- `billing-service` publica `PaymentConfirmed` → `enrollment-service` lo consume (flujo correcto Pago → Enrollment)
- `notification-service` consume **solo eventos whitelisted** (no `*`)
- Tracking/xAPI vive en **telemetry-lrs-service** separado (no en content/delivery)
- Integraciones (pagos/proctoring) son **adapters separados**, sin SDKs en core

---

## 2. Event-Driven Architecture y Contratos

### Principios

1. **Eventos inmutables:** no se reescriben; se versionan
2. **Envelope estándar:** todos los eventos comparten un formato común para tooling/observabilidad
3. **Idempotencia obligatoria:** consumidores toleran duplicados
4. **Schema registry + compatibilidad:** validación y reglas de backward/forward compatibility
5. **No "commands" por eventos cross-domain:** eventos son "hechos"; comandos son internos del servicio (o vía API)

### Decisiones Recomendadas

**Envelope estándar (CloudEvents 1.0):**
- `specversion`, `id`, `source`, `type`, `subject`, `time`, `datacontenttype`
- **Extensions:** `tenant_id`, `correlation_id`, `causation_id`, `schema_version`

**Naming:** `{Context}.{EventName}.v{n}` (ej. `Enrollment.StudentEnrolled.v1`)

**Particionado (Kafka):** key por `tenant_id + aggregate_id` cuando el orden importa

**Ejemplo de evento:**

```json
{
  "specversion": "1.0",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "source": "billing-service",
  "type": "Billing.PaymentConfirmed.v1",
  "subject": "payment/pay_123",
  "time": "2026-01-26T10:30:00Z",
  "datacontenttype": "application/json",
  "extensions": {
    "tenant_id": "tenant-corp-001",
    "correlation_id": "req-123-abc",
    "causation_id": "cmd-987",
    "schema_version": "1"
  },
  "data": {
    "payment_id": "pay_123",
    "order_id": "ord_555",
    "amount_cents": 19900,
    "currency": "EUR",
    "payer_ref": "usr_456",
    "confirmed_at": "2026-01-26T10:30:00Z"
  }
}
```

### Antipatrones a Evitar

- ❌ Eventos genéricos tipo `DataChanged`
- ❌ Payloads gigantes que "exportan el modelo interno"
- ❌ Consumers que vuelven a llamar al producer para completar datos (acoplamiento bidireccional)
- ❌ Publicar PII sin minimización/masking y sin base legal
- ❌ No definir política de versionado/deprecación

### Patrón Outbox + Inbox

**Outbox (Producer):**
- Transacción atómica: escribir cambio de estado + evento en tabla `outbox`
- Proceso separado publica desde outbox → broker
- Marca evento como publicado/fallido
- DLQ para re-intentos con backoff exponencial

**Inbox (Consumer):**
- Escribe evento recibido en tabla `inbox` con `event_id` como PK
- Procesa evento (idempotente)
- Marca como procesado
- DLQ para eventos no procesables

### Checklist de Revisión

- [ ] Evento cumple envelope estándar (CloudEvents-like)
- [ ] Schema registrado y validado (compatibilidad backward/forward)
- [ ] Producer usa outbox; consumer usa inbox
- [ ] Eventos sensibles: PII minimizada, campos enmascarados si aplica
- [ ] Existe CDC (Pact/CDC equivalente) para eventos críticos

### Métricas / Indicadores

- **Breaking changes en schemas:** 0/mes
- **Event lag p99:** < 5s (dominios críticos)
- **DLQ rate:** < 0.1%
- **Reprocessing success rate:** > 99.9%

---

## 3. APIs y Comunicación Sincrónica (Solo Donde Corresponde)

### Principios

1. **Sync solo para:** authN/authZ, queries críticas, comandos idempotentes que requieren respuesta inmediata
2. **Timeouts agresivos:** 1–3s normal, 10s batch máximo
3. **Límite de fan-out:** evitar más de 2 hops sync
4. **Read models:** si necesitás joins, construí vistas materializadas por eventos
5. **CDC para APIs públicas:** consumer-driven contracts para evitar romper integraciones

### Decisiones Recomendadas

- **REST:** APIs públicas e integraciones
- **gRPC:** service-to-service con latencia crítica
- **GraphQL:** solo en BFFs si el frontend lo necesita (no directo a servicios core)
- **Rate limiting:** por tenant + api key (token bucket)
- **Paginación:** cursor-based para listas grandes

### Resiliencia Sincrónica (Obligatoria)

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
   [Timeout: 3s]
   [Retry: 3x con backoff + jitter]
   [Circuit Breaker: Open after 5 failures]
   [Bulkhead: máx 100 concurrent requests]
       │
       ├─→ Éxito → [Success]
       ├─→ Timeout → [Circuit Open] → [Fallback]
       └─→ 5xx → [Backoff] → [DLQ si async]
```

### Antipatrones a Evitar

- ❌ Retries sin backoff + jitter
- ❌ API sin versionado
- ❌ Gateway con lógica de negocio
- ❌ "Joins distribuidos" en runtime

### Checklist de Revisión

- [ ] OpenAPI publicado por versión
- [ ] Timeouts configurados en cliente y servidor
- [ ] Circuit breaker + fallback implementado
- [ ] CDC (Pact) para endpoints públicos críticos
- [ ] Rate limits por tenant

### Métricas / Indicadores

- **Latency p99:** lectura < 500ms, escritura < 2s
- **5xx rate:** < 0.1%
- **Circuit breaker trips:** tendencia controlada y explicable

---

## 4. Multi-tenancy y Aislamiento (Con Tiering)

### Principios

1. **Tenant en todo:** headers, eventos, logs, traces
2. **Aislamiento progresivo:** shared por defecto, dedicated para enterprise
3. **Quotas y fairness:** límites por tenant (API, storage, jobs, concurrencia)
4. **Segregación de recursos:** colas por tenant/plan para evitar noisy neighbors
5. **Auditoría:** acciones sensibles con tenant+actor+recurso

### Tiering Recomendado

| Tier | Características | Datos | Colas/Jobs | Límites |
|------|---|---|---|---|
| **Shared (SMB)** | Multi-tenant en el mismo cluster | DB compartida + RLS + índices por `tenant_id` | Compartidas con fairness (weights) | API: 1k req/min, Storage: 10GB, Concurrent: 50 |
| **Dedicated (Enterprise)** | Cluster/namespace dedicado | DB dedicado o schema dedicado | Dedicadas por tenant | API: unlimited, Storage: custom, Concurrent: custom |

### Autorización y Control

- **JWT con tenant_id:** validación en gateway + enforcement en cada servicio
- **Rate limiting:** token bucket per-tenant y per-endpoint
- **Feature flags:** por tenant (LaunchDarkly/Unleash o servicio interno en tenant-service)

### Antipatrones a Evitar

- ❌ Confiar en tenant_id del cliente sin validar
- ❌ Falta de `WHERE tenant_id = ?`
- ❌ Throttling global (sin fairness)
- ❌ Logs sin tenant_id (debug imposible)

### Checklist de Revisión

- [ ] RLS activo (si aplica) y tests de aislamiento automatizados
- [ ] Índices compuestos con tenant_id como primer campo
- [ ] Quotas configurables por plan/tier
- [ ] Colas y jobs con fairness (por tenant)

### Métricas / Indicadores

- **Tenant isolation breaches:** 0
- **Noisy neighbor incidents:** 0 críticos/mes
- **Quota enforcement accuracy:** 100%

---

## 5. Integraciones (Ultra Pluggable Sin "God Gateway")

### Principios

1. **Adapter pattern:** vendors externos se encapsulan en servicios adapter
2. **Contratos internos estables:** el core habla un "lenguaje del dominio", no del vendor
3. **Cambiar vendor con dolor mínimo:** config + adapter, no reescritura del core
4. **Webhooks normalizados:** webhook → validación → evento interno normalizado
5. **Observabilidad por vendor:** métricas separadas por adapter y tenant

### Decisiones Recomendadas

- **Adapters por capability:** pagos, proctoring, video, CRM (servicios separados, no monolítico)
- **Config centralizada:** tenant-service define vendor por tenant (ej. Stripe vs PayPal)
- **Idempotency keys:** event_id/payment_id como llave de idempotencia para vendors
- **Circuit breakers en adapters:** los vendors fallan. Siempre.

**Ejemplo: flujo de pago normalizado**

```
Stripe/PayPal webhook
         │
         ▼
payment-adapter-stripe (verifica firma)
         │
         ▼
    Normaliza a Billing.PaymentConfirmed.v1
         │
         ▼
    Publica evento interno
         │
         ▼
billing-service consume y valida
         │
         ▼
Publica Billing.PaymentConfirmed → enrollment-service
         │
         ▼
enrollment-service crea inscripción
         │
         ▼
Publica Enrollment.StudentEnrolled → learning-access-service
```

### Antipatrones a Evitar

- ❌ SDK vendor en servicios core
- ❌ `if (vendor == "stripe")` en dominio
- ❌ Webhooks sin verificación de firma
- ❌ Adapter que filtra el modelo del vendor a todo el sistema

### Checklist de Revisión

- [ ] Adapter implementa interfaz de dominio (ej. PaymentProcessor)
- [ ] Secrets en vault/secret manager con rotación
- [ ] Runbook de migración vendor X → Y
- [ ] Métricas y alertas por adapter/vendor

### Métricas / Indicadores

- **Vendor API error rate:** < 1%
- **Webhook processing:** < 500ms a "evento publicado"
- **Vendor migration time:** < 1 semana (sin downtime)

---

## 6. Datos, Consistencia y Workflows Distribuidos

### Principios

1. **Consistencia eventual por defecto**
2. **Sagas para workflows multi-paso**
3. **Read models por necesidad, no por moda**
4. **Rebuild posible:** cualquier vista materializada debe reconstruirse desde eventos
5. **Migraciones por servicio, coordinadas por contratos**

### Workflows Críticos

**Flujo de Inscripción (Pago → Enrollment):**

```
Billing.PaymentConfirmed (evento)
         │
         ├→ billing-service persiste
         │
         └→ enrollment-service consume
             │
             ▼
          Validar estudiante (sync a iam-service)
             │
             ▼
          Crear inscripción
             │
             ▼
          Publica Enrollment.StudentEnrolled
             │
             ├→ learning-access-service: otorga acceso
             ├→ progress-service: inicializa tracking
             └→ notification-service: envía bienvenida
```

**Sagas Recomendadas:**

- **Choreography:** flujos simples (2–3 pasos) como el de arriba
- **Orchestration (Temporal.io/Camunda):** flujos largos o críticos (ej. certificación con múltiples validaciones)

### Antipatrones a Evitar

- ❌ 2PC / transacciones distribuidas
- ❌ CQRS en todo
- ❌ Read models sin estrategia de rebuild
- ❌ Workflows sin compensación

### Checklist de Revisión

- [ ] Diagrama del workflow (eventos, estados, compensaciones)
- [ ] Idempotencia por step
- [ ] Timeouts del workflow
- [ ] Rebuild documentado (bootstrap desde eventos)

### Métricas / Indicadores

- **Saga completion rate:** > 99%
- **Compensation rate:** < 5%
- **Read model lag:** < 30s (según criticidad)

---

## 7. Seguridad End-to-End

### Principios

1. **Zero trust interno:** no confiar en red interna
2. **AuthN/AuthZ explícito service-to-service**
3. **RBAC + ABAC**
4. **Secrets fuera del código**
5. **Auditoría de acciones sensibles**

### Decisiones Recomendadas

- **mTLS:** mesh opcional, pero recomendado si hay alto volumen de S2S
- **AuthZ:** OPA/Policy-as-code para reglas complejas
- **PII:** minimización + cifrado + retención + acceso auditado
- **SAST/DAST/Dependency scanning:** en CI obligatorio

### Antipatrones a Evitar

- ❌ PII en logs
- ❌ Permisos globales sin tenant scoping
- ❌ Validar por IP en vez de identidad

### Checklist de Revisión

- [ ] Rotación de secretos automatizada
- [ ] Principio de mínimo privilegio
- [ ] Auditoría inmutable para acciones clave
- [ ] Pen-test periódico (mínimo anual)

### Métricas / Indicadores

- **Vuln SLA:** críticas < 7 días
- **Secrets rotation compliance:** 100%
- **Auth failures anomalous:** alertas por spikes

---

## 8. Fiabilidad, Performance y Resiliencia

### Principios

1. **SLO/SLI explícitos por servicio**
2. **Error budgets guían prioridad**
3. **Timeouts + circuit breakers + bulkheads**
4. **Backpressure (fallar rápido)**
5. **Capacidad para picos (exámenes/cohortes)**

### SLOs Recomendados

| Servicio | SLO | Justificación |
|----------|-----|---------------|
| **iam-service** | 99.95% | Crítico para toda operación |
| **enrollment-service** | 99.9% | Crítico pero puede degradar lectura |
| **billing-service** | 99.9% | Crítico para ingresos |
| **telemetry ingest** | 99.9% con buffers | Eventual, puede acumular |
| **catalog-service** | 99.5% | Lectura principal |
| **assessment-service** | 99.9% | Crítico en horarios de examen |

### Protección de Picos

Exámenes/cohortes generan picos. Mitigación:

- **Límites de concurrencia por tenant** (ej. máx 100 intentos simultáneos)
- **Autoscaling** basado en predicción (sabemos cuándo son exámenes)
- **Degradación controlada:** si assessment explota, enrollments sigue (separación)
- **Colas + DLQ:** telemetry ingest usa colas, no llamadas directas

### Antipatrones a Evitar

- ❌ Retries sin límites
- ❌ No definir límites de concurrencia
- ❌ Fan-out sync masivo

### Checklist de Revisión

- [ ] SLO publicado + alertas por burn rate
- [ ] Bulkheads configurados
- [ ] DLQ con playbook de reprocess
- [ ] Load testing para picos reales

### Métricas / Indicadores

- **Availability por servicio vs SLO**
- **p99 latency**
- **Queue depth y DLQ rate**
- **Autoscaling events correlacionados con demanda**

---

## 9. Observabilidad Distribuida (OpenTelemetry)

### Principios

1. **Traces E2E obligatorios**
2. **Logs estructurados (JSON)** con tenant/correlation
3. **Métricas de oro:** latency, traffic, errors, saturation
4. **Alertas por burn rate, no por "ruido"**

### Decisiones Recomendadas

- **OpenTelemetry** como estándar
- **IDs propagados:**
  - `correlation_id` por request HTTP/evento
  - `causation_id` por comando/evento que dispara otros
- **Propagación:** HTTP headers + Kafka headers + contexto de evento

**Dashboards recomendados:**

1. **Funnel de inscripción:** PaymentInitiated → PaymentConfirmed → StudentEnrolled → AccessGranted
2. **Exámenes:** AttemptStarted → Submitted → Graded
3. **Aislamiento tenant:** top tenants por consumo/errores
4. **SLO dashboard:** availability, latency, error rate por servicio

### Antipatrones a Evitar

- ❌ Logs sin tenant_id/correlation_id
- ❌ Alertas por umbrales fijos sin contexto
- ❌ Tracing solo en errores

### Checklist de Revisión

- [ ] Tracing propagado en HTTP + eventos
- [ ] Cardinalidad controlada en métricas (no high-cardinality por defecto)
- [ ] Runbooks linkeados desde alertas
- [ ] Logs estructurados (JSON) con `tenant_id`, `service`, `level`, `message`

### Métricas / Indicadores

- **MTTD/MTTR mejorando quarter-over-quarter**
- **Tracing coverage:** > 95% requests críticos
- **Alert-to-resolution ratio:** < 30 min p95

---

## 10. DevOps y Delivery

### Principios

1. **Independencia de build/deploy por servicio**
2. **Entornos consistentes (IaC)**
3. **Despliegues progresivos + rollback**
4. **Seguridad en pipeline (supply chain)**
5. **Feature flags como herramienta de control de riesgo**

### Decisiones Recomendadas

**Mono-repo vs multi-repo:** permitido ambos. Lo **no negociable** es CI/CD independiente.

**Golden path (plantilla de servicio):**
- Scaffolding con OTel, health checks, lint, testing
- Dockerfile multi-stage optimizado
- Helm charts con values por env
- Pipelines pre-configuradas (build → test → scan → deploy)

**Estrategias de deploy:**
- **Canary:** nuevas versiones a 5% de tráfico, escalar gradualmente
- **Blue-green:** para servicios críticos, switch instantáneo
- **Rollback probado:** validación de rollback antes de deploy

**SBOM + firma:** (opcional pero recomendado para compliance)

### Antipatrones a Evitar

- ❌ Pipelines únicos gigantes
- ❌ Deploy manual sin audit trail
- ❌ Config/secretos hardcodeados

### Checklist de Revisión

- [ ] IaC para toda la infra (Terraform/Pulumi)
- [ ] Pipelines con tests + scans (SAST/dependency)
- [ ] Rollback probado pre-deploy
- [ ] Feature flags por tenant para rollout seguro
- [ ] Audit trail de todos los cambios

### Métricas / Indicadores

- **Lead time for changes**
- **Change failure rate**
- **MTTR**
- **Deployment frequency (objetivo > 1/día)**

---

## 11. Gobernanza Técnica (Anti-Caos)

### Principios

1. **Ownership y SLAs internos**
2. **Service catalog vivo**
3. **ADRs para decisiones relevantes**
4. **Contratos con política de deprecación**
5. **Plataforma interna: "golden path" reduce variabilidad**

### Service Catalog (Por Servicio)

```yaml
name: enrollment-service
owner:
  team: "Team Enrollment"
  slack: "#team-enrollment"
  oncall: "rotation-enrollment"
purpose: "Inscripción, cohorts, elegibilidad, acceso lógico"
slo:
  availability: 99.9%
  latency_p99: 500ms
apis:
  - openapi_url: "https://docs.internal/enrollment-service/openapi.yaml"
    version: "v2"
    deprecation_date: null
events:
  published:
    - "Enrollment.StudentEnrolled.v1"
    - "Enrollment.EnrollmentCancelled.v1"
  consumed:
    - "Billing.PaymentConfirmed.v1"
    - "Catalog.CoursePublished.v1"
data:
  database: "postgresql"
  classification: "PII, transactional"
runbooks:
  - "https://runbooks.internal/enrollment/payment-timeout"
  - "https://runbooks.internal/enrollment/dlq-reprocess"
```

### Política de Deprecación

1. **Anunciar:** comunicar a todos los consumers, plazo mínimo 60 días
2. **Dual publish:** versión v1 + v2 por ventana de transición
3. **Migración consumers:** monitorear adopción, forzar si es necesario
4. **Apagar v1:** con fecha, tracking de cualquier cliente rezagado

**Ejemplo:** Deprecar `Enrollment.StudentEnrolled.v1` → mantener 60 días → sunsetting en fecha X

### ADR (Architecture Decision Record)

```
# ADR-XXXX: [título]

**Fecha:** YYYY-MM-DD  
**Estado:** Propuesto | Aceptado | Deprecado  
**Drivers:** [qué necesidad impulsa esta decisión]

## Contexto
[qué problema estamos resolviendo]

## Decisión
[qué decidimos y por qué]

## Alternativas Consideradas
[opciones rechazadas y trade-offs]

## Consecuencias