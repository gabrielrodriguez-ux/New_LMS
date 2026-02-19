---
name: skill-creator
description: Skill para crear y estructurar nuevas habilidades (skills) en este workspace siguiendo las mejores prácticas de Antigravity.
---

# Creador de Habilidades (Skill Creator)

Esta habilidad permite al agente Antigravity ayudar al usuario a expandir sus propias capacidades mediante la creación de nuevas habilidades personalizadas.

## Cuándo usar esta habilidad
- Cuando el usuario pida crear una nueva "habilidad", "skill" o "comando especializado".
- Cuando se identifique una tarea recurrente que se beneficiaría de tener instrucciones y recursos dedicados.

## Guía de uso para el Agente

Cuando se active esta habilidad, debes seguir estos pasos:

1. **Entender la necesidad**: Pregunta al usuario (si no lo ha dicho ya):
    - ¿Cómo se llamará la habilidad? (ej. `database-optimizer`)
    - ¿Cuál es su propósito principal?
    - ¿En qué idioma prefiere las instrucciones? (Por defecto español en este workspace).

2. **Preparar la estructura**:
    - Usa el script `scripts/create-skill.sh` si está disponible para crear la carpeta en `.agent/skills/`.
    - Define la estructura base: `scripts/`, `examples/`, `resources/`.

3. **Escribir el SKILL.md**:
    - Crea el archivo `SKILL.md` con el frontmatter YAML requerido (`name` y `description`).
    - Redacta las secciones: Objetivo, Cuándo usarla, Guía de uso y Estándares.
    - Asegúrate de que las instrucciones sean claras y accionables para un agente de IA.

4. **Iterar con el usuario**:
    - Muestra un resumen de la nueva habilidad creada.
    - Pregunta si desea añadir algún script de ayuda o ejemplo de referencia.

## Estándares de Habilidades
- Las carpetas deben estar en `.agent/skills/`.
- El archivo `SKILL.md` es obligatorio y debe tener frontmatter.
- Las descripciones deben ser breves y descriptivas (en tercera persona).
- Organiza los recursos lógicamente para facilitar su descubrimiento.
- **Idioma**: En este workspace, la documentación técnica de las habilidades debe estar en Español para mantener la consistencia con las peticiones del usuario.
