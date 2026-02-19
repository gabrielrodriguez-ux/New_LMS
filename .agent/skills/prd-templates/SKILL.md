---
name: prd-templates
description: "Plantillas y guías para la creación de Documentos de Requisitos del Producto (PRD), épicas ágiles y resúmenes de funciones en español."
---

# Plantillas de Documentos de Requisitos del Producto (PRD)

Esta habilidad proporciona un conjunto de plantillas estandarizadas para documentar requisitos de producto, desde documentos completos (PRD) hasta épicas ágiles y resúmenes ligeros.

## Cuándo usar esta habilidad
- Al iniciar el diseño de una nueva funcionalidad compleja.
- Para documentar épicas en un entorno ágil.
- Cuando se necesite un resumen rápido y estructurado de una propuesta de producto.
- Para alinear a los stakeholders sobre el alcance y los objetivos de un proyecto.

---

## 1. Plantilla PRD Estándar (Completa)

Esta plantilla es ideal para proyectos grandes que requieren una definición detallada.

### Estructura:
1. **Resumen Ejecutivo**: Descripción general de una página para ejecutivos.
    - Problema, Solución, Impacto de Negocio, Cronograma, Recursos y KPIs.
2. **Definición del Problema**:
    - Problema del cliente (Quién, qué, cuándo, dónde, por qué e impacto).
    - Oportunidad de mercado (Tamaño, crecimiento, competencia, timing).
    - Caso de negocio (Potencial de ingresos, ahorro de costes, valor estratégico).
3. **Descripción General de la Solución**:
    - Descripción de alto nivel y capacidades clave.
    - User Journey (Flujo de fin a fin).
    - Alcance (In Scope vs Out of Scope).
    - Definición de MVP (Mínimo Producto Viable).
4. **Historias de Usuario y Requisitos**:
    - Historias de Usuario con Criterios de Aceptación.
    - Requisitos Funcionales (Tabla con Prioridades P0, P1, P2).
    - Requisitos No Funcionales (Rendimiento, Escalabilidad, Seguridad).
5. **Diseño y Experiencia de Usuario**:
    - Principios de diseño, Wireframes/Mockups y Arquitectura de Información.
6. **Especificaciones Técnicas**:
    - Arquitectura, Diseño de API, Modelo de Datos y Seguridad.
7. **Estrategia de Lanzamiento (GTM)**:
    - Plan de lanzamiento, Precios y Métricas de éxito.
8. **Riesgos y Mitigaciones**: Matriz de riesgos.
9. **Cronograma e Hitos**: Fechas clave y entregables.
10. **Equipo y Recursos**: Estructura del equipo y presupuesto.

---

## 2. Plantilla de Épica Ágil

Enfocada en el desarrollo iterativo dentro de un equipo de ingeniería.

### Contenido:
- **ID de Épica y Tema**.
- **Declaración del Problema** (2-3 frases).
- **Objetivos** (Lista numerada).
- **Métricas de Éxito**.
- **Historias de Usuario Relacionadas** (Tabla con ID, Título, Prioridad y Puntos).
- **Dependencias** (Equipo/Sistema).
- **Criterios de Aceptación de la Épica**.

---

## 3. Plantilla PRD de Una Sola Página (One-Pager)

Ideal para comunicación rápida y aprobación inicial.

### Secciones:
- **Problema**: ¿Qué resolvemos y para quién?
- **Solución**: ¿Qué estamos construyendo?
- **¿Por qué ahora?**: Urgencia.
- **Métricas**: Indicadores actuales vs objetivos.
- **Alcance**: Qué entra (In) y qué queda fuera (Out).
- **Flujo de Usuario**: Diagrama de pasos.
- **Riesgos y Cronograma**.

---

## 4. Resumen de Funcionalidad (Feature Brief)

Versión ligera para exploración inicial de ideas.

### Contenido:
- **Contexto**: ¿Por qué consideramos esto?
- **Hipótesis**: "Creemos que [funcionalidad] para [usuarios] logrará [resultado]".
- **Solución propuesta**: Enfoque de alto nivel.
- **Estimación de Esfuerzo**: XS, S, M, L, XL y Nivel de Confianza.
- **Próximos Pasos**: Tareas pendientes (investigación, diseño, etc.).

---

## Cómo usar el Agente con esta Habilidad

1. **Seleccionar plantilla**: El agente debe preguntar o recomendar qué plantilla usar según el tamaño de la petición.
2. **Recopilar información**: El agente hará preguntas estructuradas basadas en las secciones de la plantilla elegida.
3. **Generar documento**: Crear el archivo `.md` en la carpeta `docs/prds/` (o la ubicación preferida del usuario).
4. **Idioma**: Todo el contenido generado se redactará en **Español**.
