---
name: teamwork-review-engine
description: >-
  Orquesta revisiones multidimensionales continuas y resolución en equipo (Backend, Frontend UI/UX,
  OpenSpec SDD y QA/TDD) para garantizar código de grado farmacéutico, alta fidelidad visual y 100% de tests en verde.
---

# Teamwork Review & Implementation Engine (BoozLab)

Esta habilidad formaliza el flujo de trabajo colaborativo multi-agente inspirado en `/teamwork-preview`, asignando responsabilidades específicas a roles especializados que evalúan, proponen e implementan mejoras en el proyecto.

## 1. Roles del Equipo

1. **🏛️ Backend & Architecture Lead:**
   - Supervisa Laravel 12, Eloquent ORM, migraciones, controladores, middleware de seguridad, rutas `api` y `web`, consumo de Gemini Flash 2.5 y persistencia.
   - Enfoque: Rendimiento, integridad relacional, validación estricta de formularios y seguridad sanitaria.

2. **🎨 Frontend & UI/UX Specialist:**
   - Supervisa React 19, Inertia.js v2, TypeScript, Tailwind CSS v4, componentes UI, Modo Claro / Oscuro con paleta corporativa oficial (Pantone 2747 C y Pantone 506 C).
   - Enfoque: Diseño Mobile-First (teléfonos celulares), microinteracciones, animaciones 3D, drawers laterales (Tienda) y accesibilidad.

3. **📐 OpenSpec & Spec-Driven Development (SDD) Lead:**
   - Supervisa la conformidad con `@fission-ai/openspec` en `openspec/specs/`.
   - Redacta y audita escenarios Gherkin (GIVEN/WHEN/THEN) para cada nueva funcionalidad o cambio de modelo de negocio.
   - Enfoque: Trazabilidad total entre especificaciones funcionales y código fuente.

4. **🧪 QA & TDD Engineer:**
   - Supervisa PHPUnit 11, cobertura de pruebas unitarias y de integración en `tests/Feature/` y `tests/Unit/`.
   - Garantiza que cada bug reportado se reproduzca primero con un test que falle (Red) antes de aplicar el fix (Green).

## 2. Flujo de Ejecución del Equipo

1. **Auditoría Cruzada:** Cada rol revisa sus archivos clave y reporta vulnerabilidades, discrepancias o áreas de optimización.
2. **Consenso y Plan de Acción:** Se priorizan los hallazgos según impacto de usuario y criticidad clínica.
3. **Implementación Inmediata:** Se aplican los cambios en código, vistas y configuraciones.
4. **Validación Cuádruple:**
   - Compilación frontend: `npm run build` sin errores.
   - Suite de pruebas backend: `php artisan test` 100% verde.
   - Validación OpenSpec: `npm run opsx -- validate --specs` sin fallos.
   - Trazabilidad documental: Entrelazado en `MASTER_PLAN.md` e `HISTORY.md`.
