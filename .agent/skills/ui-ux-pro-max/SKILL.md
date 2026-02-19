---
name: ui-ux-pro-max
description: "Inteligencia de diseño UI/UX. 50 estilos, 21 paletas, 50 emparejamientos de fuentes, 20 gráficos, 9 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui). Acciones: planificar, construir, crear, diseñar, implementar, revisar, corregir, mejorar, optimizar, mejorar, refactorizar, verificar código UI/UX. Proyectos: sitio web, landing page, dashboard, panel de administración, e-commerce, SaaS, portafolio, blog, app móvil, .html, .tsx, .vue, .svelte. Elementos: botón, modal, navbar, sidebar, tarjeta, tabla, formulario, gráfico. Estilos: glassmorphism, claymorphism, minimalismo, brutalismo, neumorphism, bento grid, modo oscuro, responsive, skeuomorphism, diseño plano. Temas: paleta de colores, accesibilidad, animación, diseño, tipografía, emparejamiento de fuentes, espaciado, hover, sombra, degradado. Integraciones: shadcn/ui MCP para búsqueda de componentes y ejemplos."
---

# UI/UX Pro Max - Inteligencia de Diseño

Guía exhaustiva de diseño para aplicaciones web y móviles. Contiene más de 50 estilos, 97 paletas de colores, 57 combinaciones de fuentes, 99 directrices de UX y 25 tipos de gráficos en 9 stacks tecnológicos. Base de datos consultable con recomendaciones basadas en prioridad.

## Cuándo Aplicar

Referencia estas directrices cuando:
- Diseñes nuevos componentes o páginas de UI.
- Eligas paletas de colores y tipografía.
- Revises código para detectar problemas de UX.
- Construyas landing pages o dashboards.
- Implementes requisitos de accesibilidad.

## Categorías de Reglas por Prioridad

| Prioridad | Categoría | Impacto | Dominio |
|-----------|-----------|---------|---------|
| 1 | Accesibilidad | CRÍTICO | `ux` |
| 2 | Toque e Interacción | CRÍTICO | `ux` |
| 3 | Rendimiento | ALTO | `ux` |
| 4 | Layout y Responsive | ALTO | `ux` |
| 5 | Tipografía y Color | MEDIO | `typography`, `color` |
| 6 | Animación | MEDIO | `ux` |
| 7 | Selección de Estilo | MEDIO | `style`, `product` |
| 8 | Gráficos y Datos | BAJO | `chart` |

## Referencia Rápida

### 1. Accesibilidad (CRÍTICO)
- `color-contrast`: Ratio mínimo de 4.5:1 para texto normal.
- `focus-states`: Anillos de enfoque visibles en elementos interactivos.
- `alt-text`: Texto alternativo descriptivo para imágenes significativas.
- `aria-labels`: aria-label para botones que solo contienen iconos.
- `keyboard-nav`: El orden de tabulación coincide con el orden visual.
- `form-labels`: Usar etiquetas con el atributo 'for'.

### 2. Toque e Interacción (CRÍTICO)
- `touch-target-size`: Objetivos táctiles mínimos de 44x44px.
- `hover-vs-tap`: Usar clic/toque para interacciones primarias.
- `loading-buttons`: Deshabilitar el botón durante operaciones asíncronas.
- `error-feedback`: Mensajes de error claros cerca del problema.
- `cursor-pointer`: Añadir cursor-pointer a elementos clicables.

### 3. Rendimiento (ALTO)
- `image-optimization`: Usar WebP, srcset, carga diferida (lazy loading).
- `reduced-motion`: Verificar prefiere-movimiento-reducido.
- `content-jumping`: Reservar espacio para contenido asíncrono.

### 4. Layout y Responsive (ALTO)
- `viewport-meta`: width=device-width, initial-scale=1.
- `readable-font-size`: Mínimo 16px para texto de cuerpo en móviles.
- `horizontal-scroll`: Asegurar que el contenido quepa en el ancho del viewport.
- `z-index-management`: Definir escala de z-index (10, 20, 30, 50).

### 5. Tipografía y Color (MEDIO)
- `line-height`: Usar 1.5-1.75 para texto de cuerpo.
- `line-length`: Limitar a 65-75 caracteres por línea.
- `font-pairing`: Emparejar personalidades de fuentes de título y cuerpo.

### 6. Animación (MEDIO)
- `duration-timing`: Usar 150-300ms para micro-interacciones.
- `transform-performance`: Usar transform/opacity, no width/height.
- `loading-states`: Pantallas de esqueleto (skeletons) o spinners.

### 7. Selección de Estilo (MEDIO)
- `style-match`: Coincidir el estilo con el tipo de producto.
- `consistency`: Usar el mismo estilo en todas las páginas.
- `no-emoji-icons`: Usar iconos SVG, no emojis.

### 8. Gráficos y Datos (BAJO)
- `chart-type`: Coincidir el tipo de gráfico con el tipo de dato.
- `color-guidance`: Usar paletas de colores accesibles.
- `data-table`: Proporcionar alternativa de tabla para accesibilidad.

## Cómo Usar esta Habilidad

Cuando el usuario solicite trabajo de UI/UX (diseñar, construir, crear, implementar, revisar, corregir, mejorar), sigue este flujo:

### Paso 1: Analizar Requisitos del Usuario
Extrae información clave: Tipo de producto, Palabras clave de estilo, Industria y Stack (por defecto `html-tailwind`).

### Paso 2: Generar Sistema de Diseño (REQUERIDO)
Siempre inicia definiendo el sistema de diseño: patrón, estilo, colores, tipografía, efectos y anti-patrones.

### Paso 3: Búsquedas Detalladas (si es necesario)
Busca directrices específicas por dominio (style, chart, ux, typography, landing).

### Paso 4: Guías del Stack (Por defecto: html-tailwind)
Obtén las mejores prácticas específicas de implementación para el stack elegido (Next.js, React, tailwind, etc.).

## Reglas Comunes para una UI Profesional
Asuntos que suelen pasarse por alto:
- **Sin Iconos Emoji**: Usar siempre SVG (Heroicons, Lucide).
- **Cursor Pointer**: Añadir a todo lo clicable.
- **Transiciones Suaves**: 150-300ms para cambios de estado.
- **Contraste**: Mínimo 4.5:1.
- **Navbar Flotante**: Añadir espaciado de los bordes.

## Lista de Verificación Pre-Entrega
- [ ] Sin emojis como iconos.
- [ ] Iconos consistentes.
- [ ] Logos de marca correctos (Simple Icons).
- [ ] El hover no desplaza el layout.
- [ ] Cursor pointer en elementos clicables.
- [ ] Responsive en 375px, 768px, 1024px, 1440px.
- [ ] Prueba de modo claro/oscuro.
