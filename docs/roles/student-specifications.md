# Especificaciones del Rol: Alumno (Portal Alumno)

Este documento detalla las funcionalidades clave y las historias de usuario (User Stories) diseñadas para el **Alumno** dentro de New_LMS. El Portal Alumno está diseñado para ser una experiencia inmersiva, motivadora y centrada en el consumo eficiente de conocimiento.

---

## 1. Funcionalidades Principales

### 1.1 Experiencia de Aprendizaje (Course Player)
- **Player Multi-formato**: Reproductor optimizado para vídeos, lectores de documentos (PDF/Texto) y reproductores de audio (Podcasts).
- **Control de Progreso Automático**: Marcado automático de lecciones como completadas al finalizar el video o lectura.
- **Navegación Intuitiva**: Menú lateral con la estructura del curso (Módulos/Unidades) y barra de progreso global.
- **Material Descargable**: Acceso a PDFs, guías o recursos adicionales adjuntos a cada lección.

### 1.2 Dashboard Personal y Mis Cursos
- **Resumen "Sigue Aprendiendo"**: Acceso directo a la última lección vista desde la página de inicio.
- **Catálogo de Cursos**: Vista de cursos matriculados (Activos, Próximos y Finalizados).
- **Historial de Certificaciones**: Sección para visualizar y descargar los diplomas obtenidos tras aprobar los cursos.

### 1.3 Gamificación y Progreso
- **Barra de XP y Niveles**: Visualización en tiempo real de los puntos de experiencia ganados por cada lección completada.
- **Leaderboard (Ranking)**: Clasificación de alumnos basada en puntos para fomentar la sana competencia.
- **Logros y Badges**: Medallas visuales obtenidas por hitos (ej. "7 días seguidos aprendiendo" o "Primer curso completado").

### 1.4 Social y Soporte
- **Foro de Dudas**: Espacio para preguntar dentro de cada lección y ver las respuestas de tutores o compañeros.
- **Comunidad Global**: Feed de actividad donde se muestran los hitos del resto de alumnos.
- **Perfil de Usuario**: Personalización de avatar, bio y preferencias de notificación.

---

## 2. Historias de Usuario (User Stories)

| ID | Título de la User Story | Descripción Breve | Prioridad |
|----|-------------------------|-------------------|-----------|
| **US.STUD.01** | **Continuar Aprendizaje** | Como Alumno, quiero entrar en mi dashboard y ver un botón para ir directo a la última clase que dejé a medias. | P0 |
| **US.STUD.02** | **Consumo de Podcasts IA** | Como Alumno, quiero escuchar el resumen de una lección en formato audio mientras hago otras tareas. | P1 |
| **US.STUD.03** | **Seguimiento de Progreso** | Como Alumno, quiero ver cuánto me falta para terminar el módulo actual y cuánta XP ganaré al final. | P0 |
| **US.STUD.04** | **Subida de Nivel** | Como Alumno, quiero recibir un aviso visual cuando mi XP sea suficiente para subir al siguiente nivel de prestigio. | P1 |
| **US.STUD.05** | **Descarga de Certificado** | Como Alumno, quiero descargar mi diploma en PDF inmediatamente después de aprobar el examen final. | P0 |
| **US.STUD.06** | **Interacción en Lecciones** | Como Alumno, quiero dejar una duda en un minuto exacto de un video para que el tutor sepa exactamente de qué hablo. | P1 |
| **US.STUD.07** | **Visualización de Ranking** | Como Alumno, quiero ver en qué posición del ranking de mi empresa me encuentro para motivarme a seguir. | P2 |
| **US.STUD.08** | **Modo Offline (Documentos)** | Como Alumno, quiero descargar los materiales de lectura para poder estudiar sin conexión a internet. | P2 |

---

## 3. Journey del Alumno (Learning Path)

1. **Onboarding**: El alumno recibe sus credenciales y accede a su dashboard.
2. **Exploración**: Revisa su plan de estudios y el progreso de sus compañeros en el leaderboard.
3. **Aprendizaje**: Entra en el Player, consume un video, escucha un podcast de resumen con IA y toma notas.
4. **Validación**: Realiza un quiz rápido sobre el contenido visto y gana XP inmediatamente.
5. **Certificación**: Tras completar todos los módulos, realiza el examen final y descarga su diploma.
