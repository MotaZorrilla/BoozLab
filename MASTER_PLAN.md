# Registro Maestro de Proyecto: Booz Laboratorio - Clinical AI Platform

## 🟢 FASE 1: Arquitectura de Interfaz (Completado)
- [x] **Sticky Navbar:** Estética Azul/Blanco con navegación SPA y Smooth Scroll.
- [x] **Animaciones de Entrada:** Hero con rotación dinámica vinculada al scroll.
- [x] **Trinidad Flotante:** WhatsApp, Asistente Booz AI (Modal Dark Tech) y Scroll-up inteligente.
- [x] **Estética Premium:** Fondo Gris Humo (`slate-50`) y tipografía de alto impacto.

## 🔵 FASE 2: Ingeniería de Producto (Completado)
- [x] **Ficha de Producto (PDP):** Diseño "High-Tech Clinical" con ingeniería molecular.
- [x] **Calculadora Pediátrica:** Funcional e integrada en el Clinical Hub.
- [x] **Catálogo Expandido:** Integración de líneas Acné, Cuidado Diario, Nutricional y Bienestar (12+ productos).
- [x] **Tarjetas Interactivas:** Enlaces globales SPA con micro-interacciones de hover.

## 🧠 FASE 3: Búsqueda e Inteligencia (Completado)
- [x] **Buscador Power User:** Comand Palette (Ctrl+K) y filtrado en tiempo real en sección Soluciones.
- [x] **Foco Inteligente:** Navegación desde Navbar con auto-focus en buscador de catálogo.
- [ ] **Interacción por Voz:** (Pendiente para fase futura).

## ⚖️ FASE 4: Identidad y Legal (Completado)
- [x] **Sección Empresa:** Integración total de Política de Calidad, Misión y Visión oficial.
- [x] **Acróstico de Valores:** Visualización vertical/horizontal de "BOOZ LAB VGME".
- [x] **Organigrama Técnico:** Cuadrícula de departamentos y visualizador de documentos técnicos.
- [x] **Presencia Regional:** Sedes Valle Guanape y Puerto Ordaz con datos reales, encargados y fotos de stock.
- [x] **Fat Footer:** Diseño corporativo negro con créditos a NeoBranding & @Motozorrilla.

## 🎓 FASE 5: Educación y Autoridad (Completado)
- [x] **Blog "Ciencia de la Piel":** Estructura SPA, índice editorial y vista de artículo científico.
- [x] **Glosario Farmacéutico:** Buscador técnico y filtrado alfabético.
- [x] **Casos Clínicos:** Galería de evidencia científica integrada en Home y página independiente.

## ⚙️ FASE 6: Panel Administrativo (Funcional)
- [x] **Custom React Admin:** Dashboard "Dark High-Tech" con estadísticas reales.
- [x] **Gestión de Alertas:** Sistema de Farmacovigilancia vía Modal SPA funcional.

---

## 📝 LOG DE ACTUALIZACIONES RECIENTES (Feb 2026)
- **Rebranding:** Migración total de identidad visual de "Booz Clinical" a **"Booz Laboratorio"**.
- **UX:** Implementación de Smooth Scroll global y lógica de scroll-to-focus para el buscador.
- **Contenido:** Carga masiva de activos reales desde `docs_booz` (imágenes, organigramas, políticas).
- **Estética:** Refinamiento de bordes `rounded-[3rem]`, sombras `shadow-2xl` y esquemas de color clínicos.

---

## 🚀 FASES DE INTEGRACIÓN Y TRASVASE TÉCNICO (Agosto 2026 - Presente)

## 📦 FASE 7: Persistencia y Modelado de Datos Real (Laravel 12 + Eloquent)
- [x] **Estructura Documental:** Creación de `AGENTS.md`, `PRD.md`, `SPEC.md` y `HISTORY.md`.
- [x] **Migraciones de Base de Datos:** Tablas `product_lines`, `products`, `testimonials`, `faqs`, `pharmacovigilance_reports` y `messages`.
- [x] **Modelos Eloquent:** Relaciones, casts y métodos auxiliares con tipado estricto PHP 8.2+.
- [x] **Seeder Maestro Clínico:** Inserción determinista de los 18 productos reales de `A.docx` con fórmulas, presentaciones e imágenes oficiales.

## 🎨 FASE 8: Rediseño de Bienvenida según Mockup UI Oficial
- [x] **Hero Principal:** Composición de producto real con Albemer, Dexamer y botón buscador píldora.
- [x] **Carrusel de 4 Líneas Terapéuticas:** Cuidado de la piel, Tratamiento tópico, Salud y bienestar, Cuidado especializado.
- [x] **Bento Grid Interactivo:** Tarjetas de necesidad clínica, tarjeta del asistente Lira y acceso directo a catálogo.
- [x] **Sección Autoridad y Ciencia:** Tarjetas de evidencia clínica, casos de éxito y conocimiento.
- [x] **Testimonios Médicos:** Dra. Mariana López, Dr. Alejandro Méndez y pacientes reales.
- [x] **Acordeón FAQ y Contacto Sanitario:** Con aviso de Lira y tarjetas para Consultas, Reportar y Contacto.
- [x] **Footer Legal Sanitario:** RIF J-40906185-0, Valle de Guanape, Anzoátegui, y Farmacéutica Patrocinante.

## 📄 FASE 9: Páginas Dedicadas por Producto (PDP) con WhatsApp Deep-Link
- [x] **Rutas Dedicadas por Slug:** `/producto/{slug}` con carga dinámica desde base de datos.
- [x] **Ficha Técnica Integral:** Fotografía de estuche/tubo, principios activos, indicaciones, posología y precauciones.
- [x] **Botón WhatsApp Contextual:** Enlace directo con texto prellenado por producto para consultas médicas o pedidos.
- [x] **Productos Relacionados:** Visualización de otros productos de la misma línea terapéutica.

## 🛡️ FASE 10: Canal Sanitario de Farmacovigilancia y Quejas (Cumplimiento INH)
- [x] **Formulario Oficial de Reporte:** Captura de producto, lote, fecha de vencimiento, severidad y reacción adversa.
- [x] **Generador de Tickets:** Asignación de código correlativo `BOOZ-FV-YYYY-XXXX`.
- [x] **Almacenamiento y Notificación:** Registro seguro en base de datos para auditorías sanitarias.

## 💻 FASE 11: Panel Administrativo Reactivo (`BoozAdminLayout`)
- [x] **CRUD de Productos en Tiempo Real:** Crear, editar, alternar disponibilidad y eliminar productos.
- [x] **Bandeja de Entrada de Farmacovigilancia:** Visualización y cambio de estados (Pendiente, En Revisión, Resuelto).
- [x] **Gestión de Testimonios y FAQs:** Control editorial de contenidos.

## 🧪 FASE 12: Aseguramiento de Calidad y Pruebas Automatizadas (PHPUnit 11)
- [x] **Feature Tests:** Catálogo, PDP por slug, envío de reportes de farmacovigilancia y autenticación admin.
- [x] **Unit Tests:** Fórmulas de dosificación pediátrica (Clark y Young).
- [x] **Guardrail Tests:** Validación de política de Cero Automedicación en el Asistente IA.

## 📐 FASE 13: Marco Formal de Desarrollo Dirigido por Especificaciones (OpenSpec SDD)
- [x] **Instalación y Configuración de OpenSpec:** Integración del paquete oficial `@fission-ai/openspec` en scripts de `package.json` (`npm run opsx`).
- [x] **Integración Multi-Herramienta de IA:** Generación de skills y comandos nativos para Antigravity, Cursor, Claude Code y Gemini CLI (`.gemini/`, `.cursor/`, `.agents/`).
- [x] **Especificaciones del Sistema Formalizadas (Gherkin BDD - WHEN/THEN):**
  - [`openspec/specs/catalog-and-pdp/spec.md`](file:///C:/xampp/htdocs/BoozLab/openspec/specs/catalog-and-pdp/spec.md): Catálogo de 18 productos, 4 líneas, PDP dinámicos y WhatsApp.
  - [`openspec/specs/pharmacovigilance/spec.md`](file:///C:/xampp/htdocs/BoozLab/openspec/specs/pharmacovigilance/spec.md): Canal INH, tickets correlativos `BOOZ-FV-YYYY-XXXX` y bandeja administrativa.
  - [`openspec/specs/lira-ai-assistant/spec.md`](file:///C:/xampp/htdocs/BoozLab/openspec/specs/lira-ai-assistant/spec.md): Asistente Lira, Gemini 2.5 Flash, avatar transparente y guardrail anti-automedicación.
- [x] **Validación y Monitoreo Continuo:** Validación exitosa de todas las especificaciones con `npm run opsx -- validate --specs`.

## 🛡️ FASE 14: Saneamiento de Seguridad, Integridad Clínica y Protocolo IA Equipo (Agosto 2026)
- [x] **RBAC Administrativo:** Columna `is_admin` (boolean, default false) en `users`; middleware `EnsureAdmin` (HTTP 403) con alias `admin` aplicado al grupo `['auth','verified','admin']`; seeder conserva el admin inicial.
- [x] **Hardening CSRF y Throttling:** CSRF global re-habilitado (eliminada la excepción `api/*`); `throttle` por ruta pública (farmacovigilancia 5/min, chatbot 30/min, search 60/min, messages 10/min).
- [x] **Secretos por Config:** `GEMINI_API_KEY` consumida vía `config('services.gemini.key')` y documentada vacía en `.env.example`.
- [x] **Formulario del Home Real:** Las pestañas Consulta/Reportar/Comercial persisten en el backend (`/api/messages` y `/api/farmacovigilancia`) con `X-CSRF-TOKEN`; sin mensajes de éxito ficticios.
- [x] **Tickets Correlativos Atómicos:** `generateTicketNumber()` deriva del último ticket del año (no de `count`), dentro de transacción con `lockForUpdate` + `retry()` ante colisión única.
- [x] **QA Determinista:** `GEMINI_API_KEY=""` en `phpunit.xml`; suite completa de 70 tests en verde.
- [x] **Protocolo IA Equipo:** `.agents/rules/documentation.md` y dos changes OpenSpec archivados: `admin-access-control` y `report-channel-integrity`.

## 👥 FASE 15: Teamwork Multidisciplinario & Auditoría Integral (28 de Agosto de 2026)
- [x] **Skill Formal de Equipo (`teamwork-review-engine`):** Codificada en `.agents/skills/teamwork-review-engine/SKILL.md` estructurando los roles Backend Architect, Frontend UI/UX Specialist, OpenSpec SDD Lead y QA/TDD Engineer.
- [x] **Infraestructura Backend & Trazabilidad Comercial:**
  - Creada tabla y modelo `Quote` con migración `create_quotes_table` y endpoint `POST /api/quotes` con generación correlativa `BOOZ-COT-YYYY-XXXX`.
  - FormRequests dedicados: `AskChatbotRequest` (protección DoS con límite a 1000 chars) y `StorePharmacovigilanceRequest`.
  - Seguridad en catálogo: `ProductController::show` y `search` filtran exclusivamente por productos activos (`scopeActive`).
  - Transmisión segura de API Key de Gemini mediante header `x-goog-api-key`.
  - Manejo de excepciones uniforme en `bootstrap/app.php` para endpoints `/api/*`.
- [x] **Frontend UI/UX & Fidelidad Cromática Oficial:**
  - Tokenizados en `resources/css/app.css` los colores corporativos oficiales: **Pantone 2747 C (`#002072`)** y **Pantone 506 C (`#842D44`)**, utilidades `.pb-safe` y `.no-scrollbar`.
  - Ficha Técnica (`product-detail.tsx`) adaptada 100% a Modo Oscuro nativo con badge certificado Pantone 506 C.
  - Catálogo en móvil: Selector de líneas con scroll horizontal táctil y tarjetas en 2 columnas con botón Ficha de ancho completo y acciones táctiles amplias (≥ 36px).
  - Barra inferior móvil fija con padding `pb-safe` para barras gestuales de iOS/Android.
  - Throttling con `requestAnimationFrame` en la animación 3D de scroll del Hero.
  - Modal de Lira con altura responsiva (`h-[78dvh] sm:h-[540px]`) y accesibilidad ARIA live.
  - Consistencia Universal Claro/Oscuro: Botón de alternancia integrado en `AppSidebarHeader` del panel administrativo y unificación de estado con `useAppearance()`, script síncrono anti-parpadeo en `app.blade.php`, estilos oscuros en `dashboard.tsx` y soporte dual para `appearance` y `booz_theme`.
- [x] **Nuevas Especificaciones OpenSpec (Gherkin BDD):**
  - `openspec/specs/whatsapp-order-bag/spec.md`: Bolsa de pedidos y cotizaciones por WhatsApp.
  - `openspec/specs/theme-mode-dynamic/spec.md`: Modo Claro / Oscuro dinámico con persistencia local.
  - `openspec/specs/mobile-bottom-nav/spec.md`: Barra de navegación fija inferior para dispositivos móviles.
  - Validación: `npm run opsx -- validate --specs` -> 6 pasadas, 0 fallos (100%).
- [x] **Suite de Pruebas QA/TDD Blindada:**
  - Incorporadas 4 nuevas clases de pruebas Feature: `AdminSecurityEnforcementTest`, `UnifiedContactFormTest`, `ChatbotResilienceTest`, `CatalogIntegrityTest` y `QuoteSubmissionTest`.
  - Total: **89 tests pasados en verde (331 assertions)**.

## 🐾 FASE 16: Derivación Lira a Administración, Notificaciones & Limpieza Sidebar (28 de Agosto de 2026)
- [x] **Limpieza de Enlaces Externos en Sidebar Administrativo:** Eliminados de `app-sidebar.tsx` los accesos de plantilla ajenos (repositorio externo y docs de Laravel) e incorporados enlaces clínicos oficiales: Portal Web (`/`), Farmacovigilancia INH (`/farmacovigilancia`) y Vademécum & Fórmulas (`/herramientas`).
- [x] **Captura de Leads y Derivación Asistida por Lira:**
  - Mensaje de bienvenida de Lira con ofrecimiento proactivo de contacto con administración.
  - Chip rápido *"💬 Contactar al Administrador"* y detección automática de intención de contacto (`contactar`, `administrador`, etc.).
  - Formulario de contacto interactivo embebido en el flujo de chat (`lira-assistant-modal.tsx`) para capturar nombre, teléfono/WhatsApp, correo y consulta.
  - Almacenamiento seguro en backend vía `POST /api/messages` con `source: 'lira_chatbot'` y `type: 'lira'`.
- [x] **Bandeja de Mensajes y Sistema de Alertas en Dashboard:**
  - Migración `add_admin_notes_and_source_to_messages_table` incorporando columnas `source` y `admin_notes`.
  - Tarjeta KPI de Mensajes & Leads en `/dashboard` con indicador animado de alertas (`🔴 X por responder`).
  - Tercer tab en consola: **Bandeja de Mensajes** con buscador en tiempo real, badge de origen (*Lira AI* vs *Web*), enlaces a WhatsApp y correo.
  - Modal de gestión de mensajes con respuesta directa por WhatsApp en 1 clic, conmutación de estado (*Pendiente*, *En Gestión*, *Contactado*, *Resuelto*) y registro de notas internas.
  - Controlador `AdminMessageController` y endpoint `PUT /admin/messages/{message}/status`.
- [x] **OpenSpec y Pruebas Automatizadas:**
  - Especificación actualizada en `openspec/specs/lira-ai-assistant/spec.md`.
  - Nuevas pruebas Feature: `LiraAdminHandoffTest` y `AdminMessageManagementTest`.
  - Suite completa: **94 tests pasados en verde (342 assertions)**.

## 📊 FASE 17: Exportación de Datos, Alertas Regulatorias & Analítica de Catálogo (28 de Agosto de 2026)
- [x] **Exportación Oficial de Reportes y Leads en CSV (Excel):**
  - Creados endpoints `GET /admin/reports/export-csv` y `GET /admin/messages/export-csv` con codificación UTF-8 BOM (`\xEF\xBB\xBF`) y cabeceras estándar para descarga directa compatible con Microsoft Excel.
  - Botones de descarga integrados en la cabecera de las bandejas de Farmacovigilancia y Mensajes en el Dashboard.
- [x] **Acta Oficial de Farmacovigilancia para Imprimir o Guardar como PDF:**
  - Creada plantilla clínica `resources/views/reports/acta-sanitaria.blade.php` y ruta `GET /admin/reports/{report}/print` con membrete corporativo (RIF J-40906185-0, Planta Valle de Guanape), datos del lote, paciente/notificante, dictamen técnico y firmas según la normativa sanitaria del Instituto Nacional de Higiene "Rafael Rangel" (INH).
  - Botón de acceso directo "🖨️ Imprimir / PDF Acta INH" integrado en el modal de revisión de farmacovigilancia.
- [x] **Despacho Automatizado de Alertas por Correo y Webhook:**
  - Creados Mailables `NewPharmacovigilanceAlert` (con prioridad `🚨 [URGENTE INH]` para casos Graves/Moderados) y `NewMessageLeadAlert`.
  - Integrado despacho automático en `PharmacovigilanceController::store` y `MessageController::store` con soporte de webhook opcional configurable (`ADMIN_ALERT_WEBHOOK_URL`).
- [x] **Métricas de Demanda y Conversión de Catálogo:**
  - Migración `2026_08_28_220000_add_metrics_to_products_table.php` añadiendo `views_count`, `chatbot_inquiries_count` y `quote_inquiries_count`.
  - Incremento atómico en tiempo real al visualizar productos (`ProductController::show`), consultar medicamentos con Lira (`ChatbotController::query`) o cotizar en bolsa de WhatsApp (`QuoteController::store`).
  - Nueva pestaña **"Analítica & Demanda"** en el Dashboard con tarjetas de resumen, ranking de los fármacos más solicitados y distribución de demanda por línea terapéutica.
- [x] **OpenSpec y QA/TDD:**
  - Creada especificación formal `openspec/specs/admin-analytics-and-exports/spec.md` (7/7 especificaciones 100% en verde).
  - Creada suite `AdminExportAndAlertsTest.php`.
  - Suite de pruebas completa: **100 tests pasados en verde (363 assertions)**.

> [!IMPORTANT]
> **Rotación manual pendiente:** la `GEMINI_API_KEY` real que sigue en `.env` debe rotarse por el propietario (el código ya la consume vía config y los tests no dependen de ella).

## 🚀 FASE 18: Arquitectura Modular del Admin, RBAC, WhatsApp Dinámico, Seeders Idempotentes y Consola Lira AI (28 de Agosto de 2026)
- [x] **Configuración Centralizada y WhatsApp Dinámico:**
  - Creada tabla `system_settings` con invalidación automática de caché `system_settings_all` en eventos de guardado y eliminación.
  - Implementado modelo `SystemSetting` con soporte de cifrado AES-256 para credenciales sensibles y servicio desacoplado `SettingService`.
  - Compartición global reactiva mediante `HandleInertiaRequests` (`settings.whatsapp_sales_phone`, `settings.company_rif`, etc.).
  - Creado hook de React `useWhatsApp()` consumido unificadamente en botón flotante, pie de página, PDP (`product-detail.tsx`), y carrito de cotizaciones (`store-cart-drawer.tsx`).
- [x] **Control de Acceso Basado en Roles (RBAC) y Gestión de Usuarios:**
  - Migración de tablas `roles` y pivote `role_user`.
  - Definidos los 4 roles oficiales del laboratorio: `super_admin`, `director_tecnico`, `gestor_comercial` y `oficial_farmacovigilancia`.
  - Implementados métodos en modelo `User`: `hasRole()`, `hasPermission()`, `assignRole()`, `syncRoles()`, `getAllPermissions()`.
  - Registrados Gates de autorización en `AppServiceProvider` y middlewares `EnsureRole` y `EnsurePermission`.
  - Creado controlador y vista `/admin/users` con altas de usuarios, asignación de roles y salvaguardas de seguridad (bloqueo de auto-eliminación y protección contra orfandad del último Super Admin).
- [x] **Desacoplamiento Modular de Vistas Administrativas:**
  - Rediseñado `app-sidebar.tsx` con 3 grupos semánticos (*Operaciones Clínicas*, *Gestión Comercial*, *Sistema & Control*), filtrado por rol y badges de alerta en tiempo real.
  - Creadas páginas administrativas modulares independientes bajo `resources/js/pages/admin/`:
    - `/admin/products`: Gestión integral del catálogo de 18 fármacos, filtros taxonómicos y modales CRUD.
    - `/admin/reports`: Consola de revisión de Farmacovigilancia INH, emisión de actas y descarga CSV.
    - `/admin/messages`: Bandeja de leads y consultas de contacto con respuesta directa en 1-clic vía WhatsApp.
    - `/admin/quotes`: Trazabilidad de cotizaciones de la tienda y métricas de demanda por fármaco.
    - `/admin/users`: Administración de colaboradores, asignación de roles y matriz de responsabilidades.
    - `/admin/ai`: Consola de Inteligencia Artificial con clave de Gemini enmascarada y simulador/playground de pruebas en vivo.
    - `/admin/settings`: Edición del WhatsApp oficial y datos legales de la planta de producción.
  - Actualizado `/dashboard` con accesos rápidos a todos los módulos preservando el contrato de props para retrocompatibilidad total.
- [x] **Arquitectura de Seeders Idempotente:**
  - Implementados `RoleSeeder`, `SystemSettingSeeder` y `UserSeeder` utilizando `updateOrCreate` con claves naturales únicas.
  - Integración orquestada en `BoozClinicalPlatformSeeder` y `DatabaseSeeder`.
- [x] **Consola Lira AI & Inyección Dinámica del Vademécum:**
  - `ChatbotController` y `callGemini` consumen la clave y modelo desde `SystemSetting` con fallback a `.env`.
  - Contexto estructurado en tiempo real agrupando los 18 fármacos clasificados bajo sus 4 líneas terapéuticas.
  - Blindaje inmutable de guardrails sanitarios (Cero automedicación, prescripción obligatoria y derivación administrativa).
- [x] **OpenSpec y QA/TDD:**
  - Incorporadas 3 nuevas especificaciones OpenSpec en Gherkin canónico (`system-settings-and-whatsapp`, `admin-rbac-user-management`, `lira-ai-dynamic-corpus`).
  - **10/10 especificaciones OpenSpec validadas al 100%** (`npm run opsx -- validate --specs`).
  - Nuevas pruebas Feature implementadas: `AdminRbacAuthorizationTest`, `AdminUserManagementTest`, `DynamicSystemSettingsTest`, `ChatbotDynamicCorpusTest`, `AdminQuoteManagementTest`.
  - Suite de pruebas de regresión: **116 tests pasados en verde (442 assertions)** en PHPUnit.
  - Compilación Vite de producción verificada: **2.761 módulos transformados sin errores**.
