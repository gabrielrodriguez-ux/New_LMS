# Especificaciones del Rol: Tutor / Instructor

Este documento detalla las funcionalidades clave y las historias de usuario (User Stories) diseñadas para el rol de **Tutor** dentro de New_LMS. El objetivo de este rol es guiar el aprendizaje, evaluar el rendimiento y garantizar el compromiso del alumno.

---

## 1. Funcionalidades Principales

### 1.1 Gestión Académica y Seguimiento
- **Dashboard del Tutor**: Vista consolidada de las cohortes (grupos) asignadas.
- **Monitor de Progreso**: Visualización granular del avance de cada alumno en los módulos y unidades.
- **Registro de Asistencia**: Validación de la actividad de los alumnos para cumplimiento (FUNDAE).

### 1.2 Evaluación y Feedback
- **Centro de Calificaciones**: Panel para corregir tareas, proyectos y exámenes.
- **Feedback Enriquecido**: Capacidad de enviar comentarios en texto, audio o video a las entregas de los estudiantes.
- **Gestión de Quizzes**: Revisión de intentos y posibilidad de anular o ajustar calificaciones.

### 1.3 Comunicación e Interacción
- **Centro de Mensajería**: Comunicación directa (1:1) o grupal con los alumnos.
- **Gestión de Dudas**: Hilos de comentarios vinculados a lecciones específicas para resolver preguntas técnicas o teóricas.
- **Anuncios de Cohorte**: Publicación de avisos importantes que disparan notificaciones (email/app).

### 1.4 Intervención y Analítica
- **Alertas "At Risk"**: Identificación proactiva de alumnos con baja actividad o rendimiento inferior a la media.
- **Reportes de Grupo**: Generación de informes sobre el "sentimiento" y nivel de comprensión general de la clase.

---

## 2. Historias de Usuario (User Stories)

| ID | Título de la User Story | Descripción Breve | Prioridad |
|----|-------------------------|-------------------|-----------|
| **US.01** | **Visualizar Salud de Cohorte** | Como Tutor, quiero ver un resumen visual del progreso de mi grupo para identificar cuellos de botella. | P0 |
| **US.02** | **Corrección de Entregas** | Como Tutor, quiero una interfaz ágil para revisar archivos subidos por alumnos y asignar puntajes. | P0 |
| **US.03** | **Feedback Personalizado** | Como Tutor, quiero dejar comentarios específicos en partes de una tarea para que el alumno sepa qué mejorar. | P1 |
| **US.04** | **Identificación de Alumnos en Riesgo** | Como Tutor, quiero recibir alertas de alumnos que no han entrado en 7 días para contactarlos proactivamente. | P0 |
| **US.05** | **Resolución de Dudas en Contexto** | Como Tutor, quiero responder dudas en el Player de video para que otros alumnos se beneficien de la respuesta. | P1 |
| **US.06** | **Comunicación Masiva** | Como Tutor, quiero enviar un mensaje a toda la cohorte para recordarles una fecha de entrega. | P1 |
| **US.07** | **Reporte de Calificaciones para Admin** | Como Tutor, quiero exportar las notas finales de una cohorte para su certificación oficial. | P1 |
| **US.08** | **Coordinación con Docentes** | Como Tutor, quiero un canal privado con otros docentes del mismo curso para alinear criterios. | P2 |

---

## 3. Flujo de Trabajo Sugerido (User Journey)

1. **Inicio del día**: El tutor entra en `/tutor` y revisa las alertas de "Alumnos en Riesgo".
2. **Revisión**: Accede al "Centro de Calificaciones" para corregir las tareas pendientes del día anterior.
3. **Interacción**: Responde hilos de dudas en el foro o lecciones de video.
4. **Cierre**: Publica un anuncio motivador sobre el próximo módulo que se desbloquea.
