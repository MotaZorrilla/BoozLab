# 🔬 Booz Laboratorio — Clinical AI Platform
### Plataforma Integral Farmacéutica, Vademécum Clínico & Asistente IA Lira

[![PHPUnit Tests](https://img.shields.io/badge/PHPUnit-139%20passed%20(556%20assertions)-brightgreen.svg)](tests/)
[![OpenSpec](https://img.shields.io/badge/OpenSpec-13%2F13%20validated-blue.svg)](openspec/)
[![Laravel](https://img.shields.io/badge/Laravel-12.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.x%20%2B%20Inertia.js%20v2-61dafb.svg)](https://inertiajs.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4%20Tri--Tier%20(4K%2F1080p%2FMóvil)-38bdf8.svg)](https://tailwindcss.com)

---

## 📖 Descripción General

**Booz Laboratorio** es una plataforma tecnológica farmacéutica de vanguardia diseñada para **BOOZ LABORATORIO VGME, C.A.** (RIF J-40906185-0, Planta Principal en Valle de Guanape, Edo. Anzoátegui, Venezuela).

Combina un portal médico y catálogo de 18 productos farmacéuticos organizados en 4 líneas terapéuticas, un canal oficial regulatorio de Farmacovigilancia (conforme a las normativas del INH "Rafael Rangel"), una tienda virtual integrada con cotizaciones formales por WhatsApp, una consola administrativa RBAC completa y el asistente virtual inteligente **Lira AI** con base de conocimiento documental RAG y guardrails sanitarios.

---

## 🏛️ Arquitectura del Sistema

* **Backend:** Laravel 12 con PHP 8.2+, Eloquent ORM, autenticación por sesión segura y protección estricta contra inyecciones y accesos no autorizados.
* **Frontend:** Inertia.js v2 + React 19 + TypeScript + Tailwind CSS v4 con arquitectura responsiva tri-nivel (Dispositivos Móviles, Escritorio 1080p y Pantallas 4K / Ultra-Wide).
* **Motor de IA (Lira):** Integración desacoplada con Google Gemini (`gemini-2.5-flash`) mediante `LiraAiService`, con respaldo determinista dinámico en base de datos (`system_settings`) y guardrails clínicos éticos.
* **Bolsa de Pedidos & WhatsApp:** Carrito client-side en `localStorage`, cálculo de totales en USD, advertencias de prescripción facultativa médica y exportación de pedidos estructurados a WhatsApp.
* **Vademécum Oficial en PDF:** Generación e impresión de fichas técnicas en formato azul corporativo (`#002072`) con fotografía en alta resolución del medicamento, posología y protocolos sanitarios.

---

## 🚀 Rutas Principales

### Portal Público & Clínico
| Ruta | Descripción |
| :--- | :--- |
| `/` | Landing page principal con Hero 3D, carrusel con efecto peek, selector de líneas y bento grid. |
| `/producto/{slug}` | Ficha Técnica Médica individual con galería, botón directo de compra y descarga de Vademécum. |
| `/producto/{slug}/vademecum` | Ficha técnica y Vademécum Clínico imprimible en PDF con formato azul corporativo Booz. |
| `/farmacovigilancia` | Canal oficial regulatorio para reporte de sospechas de RAM y fallas de lote según normativa INH (100% Dark Mode). |
| `/herramientas` | Calculadora Pediátrica Clínica reactiva con 3 métodos oficiales (Clark, Régimen Ponderado, Young). |
| `/glosario` | Glosario terminológico de farmacología y dermatología. |
| `/casos-clinicos` | Casos de estudio y evidencia clínica de formulaciones Booz. |

### Consola Administrativa (`/admin/*`)
| Ruta | Módulo | Acceso Autorizado |
| :--- | :--- | :--- |
| `/dashboard` | Tablero ejecutivo con KPIs en tiempo real y fichas operativas. | Todos los roles administrativos |
| `/admin/products` | Gestión de catálogo, inventario, precios y editor integral de fichas médicas. | Superadmin, Director Técnico, Gestor Comercial |
| `/admin/reports` | Bandeja de Farmacovigilancia INH, actas sanitarias imprimibles y exportación CSV. | Superadmin, Director Técnico, Oficial de FV |
| `/admin/messages` | Bandeja de mensajes de contacto y leads comerciales con respuesta WhatsApp. | Superadmin, Gestor Comercial |
| `/admin/quotes` | Administrador de tienda virtual, cotizaciones manuales y comprobantes oficiales. | Superadmin, Gestor Comercial |
| `/admin/users` | Control de usuarios internos y asignación estricta de roles RBAC. | Superadmin |
| `/admin/ai` | Consola de Inteligencia Artificial: motor Gemini, documentos RAG y guardrails. | Superadmin |
| `/admin/settings` | Ajustes dinámicos de telefonía multicanal WhatsApp y datos corporativos. | Superadmin |

---

## 🧪 Calidad, Pruebas y Validación

La plataforma cuenta con una suite completa de pruebas automatizadas y especificaciones formales:

```bash
# Ejecutar suite completa de pruebas unitarias y de integración
php artisan test --compact

# Validar especificaciones BDD OpenSpec
npm run opsx -- validate --specs

# Compilar assets de producción
npm run build
```

* **Pruebas Automatizadas:** 139 tests pasando (556 assertions) en verde.
* **OpenSpec:** 13/13 especificaciones validadas sin errores.
* **Frontend:** 2.762 módulos compilados limpiamente con Vite en ~8.3s.

---

## 📚 Documentación del Proyecto

* [`MASTER_PLAN.md`](./MASTER_PLAN.md) — Plan maestro exhaustivo con historial acumulado de 27 fases implementadas.
* [`HISTORY.md`](./HISTORY.md) — Bitácora cronológica aditiva de hitos, commits y métricas.
* [`PRD.md`](./PRD.md) — Documento formal de requerimientos del producto.
* [`SPEC.md`](./SPEC.md) — Especificación técnica viva y matemática.
* [`ROADMAP_AND_DEPLOYMENT_CHECKLIST.md`](./ROADMAP_AND_DEPLOYMENT_CHECKLIST.md) — Checklist de salida a producción y tareas operativas.
* [`openspec/specs/`](./openspec/specs/) — Catálogo de 13 especificaciones BDD en Gherkin.
