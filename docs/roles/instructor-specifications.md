# Especificaciones del Rol: Instructor / Diseñador Instruccional

Este documento detalla las funcionalidades clave y las historias de usuario (User Stories) diseñadas para el rol de **Instructor** dentro de New_LMS. A diferencia del Tutor (enfocado en el acompañamiento), el Instructor tiene la propiedad intelectual y metodológica del curso.

---

## 1. Funcionalidades Principales

### 1.1 Diseño y Estructura Curricular
- **Arquitecto de Cursos**: Capacidad para definir la jerarquía de Módulos, Unidades y Lecciones.
- **Gestor de Objetivos de Aprendizaje**: Definición de las competencias que el alumno debe adquirir en cada sección.
- **Configuración de Reglas de Desbloqueo**: Determinación de si un contenido es mandatorio o si requiere completar una tarea previa.

### 1.2 Autoría con IA (AI Content Ownership)
- **Editor Maestro de IA**: Acceso total al AI Content Studio para generar, editar y refinar materiales (audio, video, texto).
- **Control de Calidad (Oversight)**: Revisión final y "aprobación" de contenidos generados por la IA antes de que sean visibles para los alumnos.
- **Gestión de Fuentes de Conocimiento**: Carga de documentos base para entrenar a la IA en el contexto específico del curso.

### 1.3 Analítica de Contenido (Learning Analytics)
- **Mapa de Calor de Contenido**: Identificación de en qué segundos de un video los alumnos dejan de ver o dónde hay más dudas.
- **Efectividad de Evaluaciones**: Estadísticas sobre qué preguntas de un examen son las más falladas para ajustar el material docente.

### 1.4 Certificación y Calidad
- **Diseño de Exámenes Finales**: Creación de pruebas de certificación con bancos de preguntas aleatorios.
- **Estandarización de Feedback**: Creación de plantillas de corrección para que los tutores sigan una metodología unificada.

---

## 2. Historias de Usuario (User Stories)

| ID | Título de la User Story | Descripción Breve | Prioridad |
|----|-------------------------|-------------------|-----------|
| **US.INST.01** | **Diseño de Estructura de Curso** | Como Instructor, quiero crear una estructura de 3 niveles para organizar el material de forma lógica. | P0 |
| **US.INST.02** | **Generación de Lecciones con IA** | Como Instructor, quiero usar el AI Studio para convertir mis PDFs en podcasts educativos en segundos. | P0 |
| **US.INST.03** | **Aprobación de Contenido IA** | Como Instructor, quiero marcar un contenido como "Verificado" para que los alumnos sepan que es preciso. | P1 |
| **US.INST.04** | **Análisis de Falla en Exámenes** | Como Instructor, quiero ver qué pregunta fallan más los alumnos para reforzar ese tema en el contenido. | P1 |
| **US.INST.05** | **Configuración de Certificado** | Como Instructor, quiero definir el porcentaje mínimo para aprobar y que se genere el diploma automáticamente. | P1 |
| **US.INST.06** | **Gestión de Fuentes (RAG)** | Como Instructor, quiero subir el manual oficial de mi empresa para que la IA solo genere contenido basado en él. | P0 |
| **US.INST.07** | **Clonación de Cursos** | Como Instructor, quiero duplicar un curso existente para crear una versión actualizada (v2.0) rápidamente. | P2 |
| **US.INST.08** | **Definición de Prerrequisitos** | Como Instructor, quiero obligar al alumno a ver el Video A antes de poder acceder al Examen B. | P1 |

---

## 3. Diferencias Clave: Tutor vs. Instructor

| Característica | Tutor | Instructor |
|----------------|-------|------------|
| **Enfoque** | Alumno (Persona) | Contenido (Metodología) |
| **Acceso a IA** | Consumo y consulta | Creación y refinamiento |
| **Poder de Edición** | No edita la estructura | Diseña toda la estructura |
| **Interacción** | Resuelve dudas diarias | Define la estrategia de dudas |
| **Analítica** | Progreso individual/grupal | Rendimiento del material docente |
