---
name: Booz Laboratorio
description: Clinical AI Platform & Pharmaceutical Design System
colors:
  primary: "#002072"
  primary-dark: "#00154D"
  primary-light: "#0A369D"
  secondary: "#842D44"
  secondary-dark: "#581827"
  secondary-light: "#A73856"
  accent-cyan: "#06B6D4"
  accent-cyan-glow: "#22D3EE"
  neutral-bg: "#ffffff"
  neutral-surface: "#f8fafc"
  neutral-text: "#0f172a"
  neutral-muted: "#64748b"
  neutral-border: "#e2e8f0"
  dark-bg: "#0b1120"
  dark-surface: "#111827"
  dark-border: "#1f2937"
typography:
  fontFamily: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif"
  display:
    fontFamily: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
  caption:
    fontFamily: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 500
  micro:
    fontFamily: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "8px"
    fontWeight: 700
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
---

# Design System · Booz Laboratorio

## Overview
El sistema visual de **Booz Laboratorio** comunica rigor clínico, excelencia biofarmacéutica y cercanía humana. Es un lenguaje sobrio y tecnológico diseñado para profesionales de la salud, farmacéuticos y pacientes que requieren certidumbre médica, dosificaciones precisas y acceso directo a la atención de planta.

## Colors
- **Azul Marino Booz (`#002072` - PANTONE 2747 C):** Color primario institucional que proyecta solidez, seriedad farmacéutica e integridad corporativa.
- **Borgoña Clínico (`#842D44` - PANTONE 506 C):** Color secundario oficial, utilizado como acento elegante y para diferenciar líneas de salud y bienestar.
- **Cyan Médico (`#06B6D4` / `#22D3EE`):** Acento biotecnológico para indicadores activos, elementos asistenciales de Lira AI y llamadas interactivas a la acción.
- **Neutros Médicos (`#ffffff`, `#f8fafc`, `#0f172a`):** Fondo blanco limpio, superficies gris perla y textos oscuros de alto contraste legibles bajo cualquier condición de luz.

## Typography
- **Familia Tipográfica:** `Instrument Sans`.
- **Pesos:** Regular (400) para lectura técnica y posologías; Medium (500) para metadatos y etiquetas; Semibold (600) y Bold (700) para titulares.
- **Jerarquía:** Encabezados nítidos, sólidos y directos. Prohibido el texto con degradado (`bg-clip-text`) en titulares médicos.

## Layout
- **Contenedores:** Anchos máximos estandarizados (`max-w-7xl`, `max-w-screen-2xl`) con márgenes adaptativos (`px-4 sm:px-6 lg:px-8`).
- **Ritmo Vertical:** Espaciado generoso entre secciones (`py-16 lg:py-24`) que permite respirar a la información densa de vademécum.
- **Bento Grids Clínicos:** Cuadrículas asimétricas pero equilibradas para destacar evidencia científica, testimonios médicos y herramientas.

## Elevation & Depth
- **Filosofía Tonal:** Se prioriza la separación tonal (`border` sutil + `bg-slate-50`) antes que las sombras volumétricas pesadas.
- **Sombras:** Sombras clínicas suaves (`shadow-sm`, `shadow-md` con tinte azulado sutil `shadow-blue-900/5`).
- **Halos de Acento:** Iluminación sutil cyan perimetral exclusivamente reservada para la mascota Lira y puntos de estado activos.

## Shapes
- **Radio de Bordes:** Armonía entre bordes redondeados modernos (`rounded-xl` / `rounded-2xl` para tarjetas y modales; `rounded-full` para píldoras de filtro o botones de navegación).
- **Prohibición de Side-Tabs:** No utilizar bordes gruesos asimétricos unilaterales (`border-l-4`) en tarjetas. El acento debe ser perimetral, con badges o por fondo tonal.

## Components
- **Botones Primarios:** Fondo azul marino sólido con texto blanco de alto contraste y transición suave al hover.
- **Tarjetas Clínicas:** Fondo blanco o gris perla con borde sutil `border-slate-200/80` y esquinas `rounded-2xl`.
- **Pods de Lira AI:** Podios blancos luminosos con degradado tenue perla (`from-white via-slate-50 to-blue-50`) que impiden que el personaje de pelaje azul marino se mimetice con fondos oscuros.

## Do's and Don'ts
### Do:
- Usar colores de texto sólidos y con ratio de contraste WCAG AA/AAA.
- Respetar los nombres oficiales de los productos y sus concentraciones reales.
- Destacar los disclaimers médicos y el canal de Farmacovigilancia INH.
- Mantener la sobriedad clínica en tablas y fichas técnicas.

### Don't:
- **No usar gradientes morados/violetas** clichés de plantillas de IA (`from-purple-500 to-indigo-500`).
- **No usar texto con degradado (`bg-clip-text`)** en titulares principales o estadísticas.
- **No anidar tarjetas dentro de tarjetas** en cascada innecesaria.
- **No usar texto gris claro sobre fondos de color** (`text-slate-400` sobre `bg-blue-600`), usar blanco o tonos de máxima legibilidad.
- **No agregar bordes asimétricos tipo pestaña lateral (`border-l-4`)** como parche de diseño.
