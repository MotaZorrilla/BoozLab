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
  - Rediseñado `app-sidebar.tsx` centralizando en el grupo **"Operaciones"** las 4 áreas clave: Gestión de Catálogo (`/admin/products`), Farmacovigilancia INH (`/admin/reports`), Bandeja de Mensajes (`/admin/messages`) y Analítica & Cotizaciones (`/admin/quotes`), con filtrado por rol y badges reactivos.
  - Creadas páginas administrativas modulares independientes bajo `resources/js/pages/admin/`:
    - `/admin/products`: Gestión integral del catálogo de 18 fármacos con nombres reales de líneas terapéuticas (*Cuidado de la piel*, *Tratamiento tópico*, *Salud y bienestar*, *Cuidado especializado*), tabla con columnas independientes de **Producto** y **Presentación**, miniaturas fotográficas, y **Editor Integral de Fichas Médicas & Landing Page** con selector de fotografías, textos clínicos, posología, indicaciones y advertencias.
    - `/admin/reports`: Consola de revisión de Farmacovigilancia INH, emisión de actas y descarga CSV.
    - `/admin/messages`: Bandeja de leads y consultas de contacto con respuesta directa en 1-clic vía WhatsApp.
    - `/admin/quotes`: **Administrador Integral de Tienda Virtual y Demanda Comercial**:
      - CRUD completo de cotizaciones con filtros combinados (estado, tipo de cliente, canal).
      - Módulo de **Nueva Cotización Manual** para pedidos telefónicos/planta con cálculo dinámico en USD.
      - Pestaña de **Control y Carga Rápida de Stock** para actualizar unidades disponibles por fármaco.
      - **Comprobante Oficial de Cotización** imprimible y exportable en PDF con RIF y membrete del laboratorio.
      - Embudo de conversión y analítica comparativa (WhatsApp vs Carrito Web vs Manual).
      - Exportación de auditoría completa a CSV.
    - `/admin/users`: Administración de colaboradores, asignación de roles y matriz de responsabilidades.
    - `/admin/ai`: Consola de Inteligencia Artificial con clave de Gemini enmascarada y simulador/playground de pruebas en vivo.
    - `/admin/settings`: Edición del WhatsApp oficial, personalización completa de la plantilla de WhatsApp para la bolsa de pedidos (encabezado, cierre, simulador interactivo en tiempo real), perfiles de solicitante permitidos y datos legales de la planta.
  - Actualizado `/dashboard` transformado en una **Consola Ejecutiva de Administración Farmacéutica** con KPIs superiores en tiempo real y las 4 fichas interactivas de enlace, desincorporando la tabla monolítica del catálogo para máxima velocidad y claridad operativa.
- [x] **Arquitectura de Seeders Idempotente y Generosa:**
  - Implementados `RoleSeeder`, `SystemSettingSeeder` y `UserSeeder` (5 usuarios oficiales con roles asignados).
  - Creados seeders operacionales ricos: `MessageSeeder` (12 mensajes y leads de Lira AI y web), `QuoteSeeder` (8 cotizaciones de farmacias, clínicas y pacientes con sincronización de demanda) y `PharmacovigilanceReportSeeder` (6 reportes oficiales con lotes y dictámenes técnicos INH).
  - Integración orquestada en `BoozClinicalPlatformSeeder` y `DatabaseSeeder` bajo `updateOrCreate`.
- [x] **Consola Lira AI & Inyección Dinámica del Vademécum:**
  - `ChatbotController` y `callGemini` consumen la clave y modelo desde `SystemSetting` con fallback a `.env`.
  - Contexto estructurado en tiempo real agrupando los 18 fármacos clasificados bajo sus 4 líneas terapéuticas.
  - Blindaje inmutable de guardrails sanitarios (Cero automedicación, prescripción obligatoria y derivación administrativa).
- [x] **Base de Conocimiento RAG & Guardrails Sanitarios Configurables para Lira AI (`/admin/ai`):**
  - Creadas tablas y modelos `AiKnowledgeDocument` y `AiGuardrail` con soporte de estado activo/inactivo, ordenación y persistencia de archivos subidos.
  - Implementado `AiKnowledgeAndGuardrailSeeder` precargando 4 documentos maestros:
    1. *Vademécum Maestro & Fórmulas de los 18 Productos Oficiales de Booz Laboratorio* (extraído del corpus de prospectos y registros sanitarios INH).
    2. *Protocolo Operativo Estándar de Farmacovigilancia INH Rafael Rangel* (definición de RAM, lotes, caducidad y notificación en 72h).
    3. *Manual de Cotizaciones, Venta Institucional y Logística de Despacho* (bolsa de pedidos, perfiles de clientes y envíos desde Valle de Guanape).
    4. *Guía de Trato, Empatía y Protocolos de Comunicación de Lira AI* (tono empático y rigor científico).
  - 5 Guardrails sanitarios y reglas de contención preconfigurados (*Cero Automedicación*, *Venta bajo Récipe*, *Derivación a Farmacovigilancia*, *Derivación Comercial*, *Manejo Especializado de Pie Diabético con Bactrocis*).
  - Rediseñada la consola `/admin/ai` con 4 pestañas operativas: Base de Conocimiento Documental (CRUD, subida de archivos .txt/.md y toggle de entrenamiento), Guardrails Sanitarios (creación y edición con protección de reglas de sistema), Simulador Playground en vivo y Configuración de Motor Gemini.
  - Ensamblado dinámico en `ChatbotController` inyectando todo el contexto RAG activo y guardrails en tiempo real.
- [x] **OpenSpec y QA/TDD:**
  - Incorporadas 5 nuevas especificaciones OpenSpec en Gherkin canónico (`system-settings-and-whatsapp`, `admin-rbac-user-management`, `lira-ai-dynamic-corpus`, `lira-ai-training-and-guardrails`, `admin-quotes-and-store-manager`).
  - **12/12 especificaciones OpenSpec validadas al 100%** (`npm run opsx -- validate --specs`).
  - Nuevas pruebas Feature implementadas: `AdminAiTrainingAndGuardrailsTest`, `AdminRbacAuthorizationTest`, `AdminUserManagementTest`, `DynamicSystemSettingsTest`, `ChatbotDynamicCorpusTest`, `AdminQuoteManagementTest`.
  - Suite de pruebas de regresión: **133 tests pasados en verde (536 assertions)** en PHPUnit.
  - Compilación Vite de producción verificada: **2.762 módulos transformados sin errores en 8.93s**.

## 🚀 FASE 20: Checklist de Salida a Producción & Tareas Operativas Pendientes
- [x] **Documento Maestro de Salida a Producción:** Creado [`ROADMAP_AND_DEPLOYMENT_CHECKLIST.md`](file:///C:/xampp/htdocs/BoozLab/ROADMAP_AND_DEPLOYMENT_CHECKLIST.md) con el desglose de tareas operativas pendientes:
  - [ ] Rotación e inserción de la API Key definitiva de Google Gemini en `/admin/ai`.
  - [ ] Configuración del servidor SMTP corporativo en `.env` para alertas de Farmacovigilancia y Leads.
  - [ ] Webhook de alertas inmediatas para Telegram o Slack (`ADMIN_ALERT_WEBHOOK_URL`).
  - [ ] Subida de fotografías reales adicionales de estudio en el nuevo Editor de Fichas Médicas.
  - [ ] Interacción por voz con Lira Asistente Virtual (Speech-to-Text mediante Web Speech API).
  - [ ] Procedimiento de despliegue en servidor web con Nginx/Apache, SSL y optimización de cachés.

## 🎠 FASE 21: Experiencia de Catálogo en Landing Page — Carrusel Infinito con Efecto Peek, Tarjeta 100% Clickeable, Desincorporación de WhatsApp & Transición Suave (29 de Agosto de 2026)
- [x] **Carrusel Infinito con Efecto Peek (Vislumbre Lateral):**
  - En desktop (`lg` ≥ 1024px): Muestra 3 tarjetas completas centrales y un asomo ("peek") de ~5.5% de las tarjetas previa (izquierda) y siguiente (derecha).
  - En tablet (`sm`/`md`): Muestra 2 tarjetas centrales con peek lateral del 3.5%.
  - En móvil (`< 640px`): Muestra 1 tarjeta central amplia (74% del ancho) con un peek lateral del 9% a cada lado para orientar intuitivamente al usuario hacia el deslizamiento gestual.
  - Buffer de 3 copias y reposicionamiento sin salto (`transition: none` transparente) que genera un bucle infinito real en ambas direcciones.
  - Soporte de gestos táctiles nativos de swipe (`onTouchStart`, `onTouchMove`, `onTouchEnd`) para celulares y tablets.
  - Botones circulares flotantes de navegación con estilo clínico translúcido (`ChevronLeft`, `ChevronRight`) y barra de indicadores (dots) interactivos con contador de producto.
- [x] **Tarjeta Universal Clickeable (100% Ficha Técnica):**
  - Toda el área de la tarjeta está vinculada con un `<Link href={'/producto/' + slug}>` con cursor pointer, elevación en hover y escalado sutil de la fotografía.
- [x] **Depuración y Reubicación de Botones de Acción:**
  - Eliminación total del botón de WhatsApp en las tarjetas del catálogo (el canal de WhatsApp se preserva en la trinidad flotante y en la bolsa de cotizaciones).
  - Reubicación del botón "+ Pedido" en el pie de la tarjeta con aislamiento de eventos (`e.stopPropagation()` y `e.preventDefault()`) para garantizar que añadir un fármaco a la bolsa no dispare la apertura involuntaria de la ficha técnica.
- [x] **Transiciones Suaves al Seleccionar Líneas y Necesidades:**
  - Implementado estado `isFadingCategory` y manejador unificado `handleSelectCategory()` y `handleSelectNeed()` que produce un desvanecimiento suave (`opacity-0 translate-y-2 scale-[0.98] blur-[0.5px]`) de 220ms eliminando cualquier cambio brusco de contenido.
- [x] **Verificación Técnica:**
  - Compilación Vite de producción verificada: **2.762 módulos transformados sin errores en 7.79s**.
  - Suite de pruebas de regresión: **133 tests en verde (536 assertions)** en PHPUnit 11.
  - Especificaciones OpenSpec: **12/12 validadas al 100%**.

## 🧭 FASE 22: Limpieza y Reordenamiento de la Barra de Navegación, Buscador Minimalista y Consola Médica (29 de Agosto de 2026)
- [x] **Depuración de Logo e Identidad Visual Superior:**
  - Reducción del encabezado a "BOOZ LABORATORIO" eliminando el subtítulo largo para máxima ligereza y elegancia visual en la cabecera.
- [x] **Navegación Esencial de 4 Enlaces:**
  - Menú superior depurado a exactamente 4 accesos directos: **Líneas** (`/#lineas`), **Catálogo** (`/#productos`), **Conocimiento** (`/#conocimiento`) y **Farmacovigilancia** (`/farmacovigilancia`).
- [x] **Reubicación de la Calculadora Pediátrica en el Footer:**
  - Trasladada la Calculadora Pediátrica (`/herramientas`) a la columna "Canal Regulatorio & Herramientas" del footer con icono `Sparkles`, despejando el menú superior y manteniéndola accesible desde cualquier página.
- [x] **Buscador Minimalista (Solo Lupa Interactiva):**
  - Reemplazo de la caja de texto ancha por un botón icónico compacto de lupa (`Search`) con touch-target de 42px que despliega instantáneamente el modal de búsqueda rápida con atajo `Ctrl+K`.
- [x] **Conservación de la Tienda:**
  - Preservado el botón de Tienda / Bolsa de pedidos con su icono `ShoppingBag`, contador reactivo de unidades y apertura de `StoreCartDrawer`.
- [x] **Modernización del Acceso Administrativo ("Consola"):**
  - Reemplazo del botón genérico "Admin" por **"Consola"** con icono clínico `ShieldCheck`, indicador de estado en verde esmeralda y estilo dark tech con acentos Pantone 2747 C y Dark Mode, sincronizado tanto en la barra de escritorio como en la barra inferior móvil (`md:hidden`).
- [x] **Verificación Técnica:**
  - Compilación Vite de producción verificada: **2.762 módulos transformados sin errores en 8.25s**.
  - Suite de pruebas de regresión: **133 tests en verde (536 assertions)** en PHPUnit 11.
  - Especificaciones OpenSpec: **12/12 validadas al 100%**.

## 🔐 FASE 23: Login Corporativo Unificado con BoozLayout, Eliminación de Autoregistro Público y Botón de Nuevo Registro Administrativo para Superadmin (29 de Agosto de 2026)
- [x] **Depuración Total del Navbar Superior:**
  - Retirado el botón de "Habla con Lira" de la barra superior, manteniendo su presencia ergonómica en el avatar flotante de escritorio (efecto radar en esquina inferior derecha) y en el disparador central de la barra móvil inferior.
- [x] **Login Integrado con la Identidad Visual BoozLaboratorio:**
  - Pantalla de inicio de sesión (`/login`) migrada de `AuthLayout` a `BoozLayout`, conservando la barra de navegación corporativa, selector de tema claro/oscuro y pie de página institucional.
  - Tarjeta de acceso clínico centrada con insignia `ShieldCheck`, título "Consola de Administración" y campos para correo institucional y contraseña.
  - Supresión definitiva del enlace y botón público de autoregistro ("Don't have an account? Sign up").
- [x] **Botón de "Nuevo Registro / Usuario" en Dashboard para Superadmin:**
  - En la cabecera ejecutiva de `resources/js/pages/dashboard.tsx`, se integró un botón destacado en verde esmeralda con icono `UserPlus`: "Nuevo Registro / Usuario".
  - Enlace directo a `/admin/users?create=1`.
- [x] **Flujo Administrativo de Registro con Asignación de Roles en `AppLayout`:**
  - En `resources/js/pages/admin/users.tsx`, se implementó detección automática del parámetro `?create=1` para desplegar el modal de registro al instante.
  - Formulario de alta administrativa bajo `AppLayout` que captura: Nombre Completo y Cargo, Correo Electrónico Institucional, Contraseña Inicial y Selección obligatoria del Rol (Super Administrador, Director Técnico Farmacéutico, Gestor Comercial y Pedidos, Oficial de Farmacovigilancia y Calidad).
- [x] **OpenSpec Formal:**
  - Actualizada la especificación `spec/admin-rbac-user-management` incorporando el requisito de "Registro Exclusivo Interno y Restricción de Autoregistro Público".
- [x] **Verificación Técnica Integral:**
  - Compilación Vite de producción verificada: **2.762 módulos transformados sin errores en 7.95s**.
  - Suite de pruebas de regresión: **133 tests pasados en verde (536 assertions)** en PHPUnit 11.
  - Especificaciones OpenSpec: **12/12 validadas al 100%**.

## 📞 FASE 24: FAQ Comercial al Mayor, Redes Sociales Unificadas en Footer y Segmentación Multicanal de Telefonía y WhatsApp (29 de Agosto de 2026)
- [x] **6ta Pregunta Frecuente (FAQ) en Landing Page:**
  - Incorporada 6ta pregunta frecuente institucional sobre compras al mayor para droguerías, farmacias independientes y clínicas en `BoozClinicalPlatformSeeder.php` y base de datos activa, logrando un balance visual armónico en el grid frente al formulario de contacto.
- [x] **Homogeneización de Redes Sociales en el Footer:**
  - En `resources/js/layouts/booz-layout.tsx`, columna "Contacto Oficial & Redes", integradas las 4 redes oficiales unificadas bajo el identificador corporativo:
    - **Instagram:** `@booz.laboratorio` (`https://instagram.com/booz.laboratorio`)
    - **Facebook:** `booz.laboratorio` (`https://facebook.com/booz.laboratorio`)
    - **YouTube:** `booz.laboratorio` (`https://youtube.com/@booz.laboratorio`) con icono de YouTube
    - **TikTok:** `booz.laboratorio` (`https://tiktok.com/@booz.laboratorio`) con icono SVG de TikTok
- [x] **Arquitectura Multicanal de Telefonía y WhatsApp:**
  - En `SettingService` y `SystemSetting`, implementada la segmentación de 3 líneas diferenciadas con fallback automático:
    1. **WhatsApp de Atención y Soporte General:** utilizado en el botón flotante con efecto radar y consultas públicas (`whatsapp_contact_phone`).
    2. **WhatsApp de Ventas, Pedidos y Tienda Virtual:** utilizado por `StoreCartDrawer` al despachar cotizaciones y pedidos (`whatsapp_sales_phone`).
    3. **Central Telefónica de Planta:** utilizado en el enlace directo de llamada telefónica del pie de página (`company_phone`).
- [x] **Consola de Configuración para el Administrador (`/admin/settings`):**
  - En `resources/js/pages/admin/settings.tsx`, rediseñada la tarjeta de telefonía con 3 campos independientes, tips de configuración y botones de previsualización en vivo para probar ambos canales de WhatsApp de inmediato.
  - `AdminSettingController` actualizado para validar, sanear dígitos E.164 y persistir los 3 canales.
- [x] **Hook React `useWhatsApp` y Sincronización Reactiva:**
  - Hook actualizado para retornar `salesPhone`, `contactPhone`, `companyPhone` y `createWhatsAppUrl(msg, channel)`.
  - Integrado a `booz-layout.tsx` (botón flotante y footer) y a `store-cart-drawer.tsx` (canal `'sales'`).
- [x] **OpenSpec Formal:**
  - Actualizada la especificación `openspec/specs/system-settings-and-whatsapp/spec.md` con el requisito de *"Segmentación Multicanal de Líneas Telefónicas y Redes Oficiales"*.
- [x] **Verificación Técnica:**
  - Compilación Vite de producción verificada: **2.762 módulos transformados sin errores en 8.12s**.
  - Suite de pruebas de regresión: **133 tests pasados en verde (540 assertions)** en PHPUnit 11.
  - Especificaciones OpenSpec: **12/12 validadas al 100%**.

## 🧬 FASE 25: Remediación de Deuda Técnica, Calculadora Pediátrica Clínica y Desacoplamiento de LiraAiService (30 de Agosto de 2026)
- [x] **Calculadora de Dosis Pediátrica Clínica (Resolución Hallazgo A13):**
  - Desincorporada la lógica simulada `"Mock logic: 15mg per kg"` y el temporizador artificial `setTimeout` de `pediatric-calculator.tsx`.
  - Implementado un motor de cálculo clínico reactivo y determinista que ofrece 3 métodos matemáticos oficiales definidos en `SPEC.md §3`:
    1. **Regla de Clark:** Cálculo de dosificación pediátrica por peso corporal (\(D_{ped} = (P_{kg} / 70) \times D_{adulto}\)) con advertencia en pesos límite (≥60 kg).
    2. **Régimen Ponderado (mg/kg/día):** Cálculo de dosis diaria total y dosificación fraccionada por número de tomas (cada 24h, 12h, 8h o 6h), con atajos clínicos para Albemer y analgésicos infantiles.
    3. **Regla de Young:** Cálculo por edad para niños entre 1 y 12 años (\(D_{ped} = [E_{años} / (E_{años} + 12)] \times D_{adulto}\)).
  - Añadido desglose paso a paso de la fórmula aritmética y advertencia regulatoria oficial según lineamientos del INH Rafael Rangel.
- [x] **Creación del Servicio Centralizado `LiraAiService` (Resolución Hallazgos M2, E4, H8, H9, H17):**
  - Creado `app/Services/LiraAiService.php` para encapsular la interacción con Google Gemini (`gemini-2.5-flash`) y la construcción del contexto RAG (vademécum activo, documentos de entrenamiento y guardrails sanitarios).
  - Eliminada la duplicación de código entre `ChatbotController.php` y `AdminAiController.php`, unificando la simulación en el playground administrativo y las respuestas públicas.
  - Rediseñado `ChatbotController` como un controlador delgado (< 30 líneas) que inyecta `LiraAiService`.
- [x] **Deshardcodeo Dinámico de Datos Corporativos y de Contacto (Resolución Hallazgos H1 a H7):**
  - En `SettingService.php`, incorporados accesos para `legalDisclaimer()`, `companyInstagram()`, `officeLocation()` y actualización de `publicSettings()`.
  - `LiraAiService::queryDeterministic` consume en tiempo real el número de WhatsApp de ventas, RIF, Instagram y direcciones de planta y oficina desde la base de datos `system_settings`.
  - El conteo de productos y líneas terapéuticas se calcula dinámicamente desde Eloquent (`Product::active()->count()` y `ProductLine::count()`).
  - Las especificaciones de *Bactrocis* (Moxifloxacina) se extraen directamente desde el registro oficial en la tabla `products`.
- [x] **QA/TDD y Blindaje de Pruebas:**
  - Creada suite `tests/Feature/LiraAiServiceTest.php` validando la resolución dinámica de telefonía, RIF, Instagram y ensamble del prompt de sistema.
  - Suite de pruebas de regresión: **138 tests pasados en verde (551 assertions)** en PHPUnit 11.
  - Especificaciones OpenSpec: **12/12 validadas al 100%**.
  - Compilación Vite de producción verificada: **2.762 módulos transformados sin errores en 9.34s**.

## 🤖 FASE 26: Diagnóstico de Cuota Gemini, Paridad Total Landing vs Admin y Unificación del Modal Lira (30 de Agosto de 2026)
- [x] **Diagnóstico Técnico de Comportamiento Divergente:**
  - Verificada la causa raíz: la API Key de Google Gemini alcanzó el límite de cuota (`HTTP 429 You exceeded your current quota`) en el plan gratuito de Google AI Studio.
  - Al recibir HTTP 429, la landing page activa el fallback silencioso y resiliente al Motor Determinístico dinámico (nunca deja al usuario sin respuesta), mientras que la consola de pruebas de administración fallaba arrojando error de API.
- [x] **Paridad Total del Playground Administrativo (`/admin/ai`):**
  - `AdminAiController@test` refactorizado para invocar directamente `$liraAi->answer($message)`, logrando 100% de paridad con la respuesta que recibe el usuario en la landing page.
  - Interfaz de prueba en `admin/ai.tsx` actualizada para renderizar formato HTML enriquecido, tarjetas de fármacos vinculados y descargo de responsabilidad ético sanitaria del INH.
- [x] **Unificación de Instancias en el DOM (Eliminación de Modal Duplicado):**
  - Eliminada la segunda instancia no coordinada de `<LiraAssistantModal>` que residía en `home.tsx`.
  - La miniatura interactiva del Bento Grid (`Hola, soy Lira` en `home.tsx`) y el botón flotante circular con efecto radar (`booz-layout.tsx`) ahora comparten exactamente la misma instancia única del modal y el mismo historial de chat mediante el evento desacoplado `window.dispatchEvent(new CustomEvent('booz:open-lira'))`.
- [x] **Resiliencia de Conexión:**
  - Elevado el timeout de comunicación HTTP con Google Gemini de 8 a 15 segundos en `LiraAiService.php` para tolerar fluctuaciones de latencia de red.
- [x] **Verificación Integral:**
  - 138 tests pasando en verde (551 assertions).
  - Compilación Vite exitosa (2.762 módulos en 9.71s).
  - 12/12 especificaciones OpenSpec validadas.

## 📱🖥️ FASE 27: Arquitectura Responsiva Tri-Nivel: Móvil (Tienda App & Consola Táctil), 1080p y 4K Ultra-Wide (30 de Agosto de 2026)
- [x] **Configuración de Breakpoints y Contenedores Fluidos (`app.css`):**
  - Añadidos breakpoints `--breakpoint-2xl: 96rem` (1536px), `--breakpoint-3xl: 120rem` (1920px) y `--breakpoint-4k: 160rem` (2560px) en Tailwind v4 `@theme`.
  - Contenedores globales ampliados de `max-w-7xl` a fluidos: `max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1840px] px-3 sm:px-6 lg:px-8 2xl:px-12`.
- [x] **Tienda Virtual y Bolsa Móvil 100% Ancho de Pantalla (`store-cart-drawer.tsx`):**
  - Eliminado el margen residual izquierdo en móviles (`pl-0 sm:pl-10` y `w-screen max-w-full sm:max-w-md`), logrando una experiencia de compra a pantalla completa edge-to-edge estilo app móvil nativa.
- [x] **Catálogo Farmacéutico en Teléfonos & Expansión 4K (`home.tsx`):**
  - Incorporado selector interactivo en teléfonos: alternancia entre **Tienda Virtual (App Móvil con Cuadrícula de 2 Columnas al 100% de pantalla)** y **Carrusel 3D**.
  - En modo Tienda Virtual Móvil, los fármacos se despliegan en tarjetas compactas con touch targets óptimos, fotografía en proporción cuadrada, datos de dosificación, precio, enlace a ficha y botón directo `+ Pedido`.
  - En pantallas 4K / Ultra-wide (`3xl`), el carrusel expande la capacidad visual de 3 a 4 tarjetas simultáneas (`cardWidthPercent: 21.5%`), evitando estiramientos artificiales.
  - Todas las secciones de la Landing Page (Hero, Líneas, Bento Grid, Catálogo, Autoridad Sanitaria, Aval Clínico y FAQ/Contacto) aprovechan el ancho de monitores 4K.
- [x] **Consola Administrativa Adaptativa para Teléfonos (`dashboard.tsx`, `admin/products.tsx`, layouts):**
  - `admin/products.tsx`: Implementada **Vista Móvil de Tarjetas Táctiles** (`block md:hidden`) junto con la tabla tabular de 10 columnas en escritorio (`hidden md:block`), permitiendo a los administradores buscar, activar/desactivar, editar y ver fichas de fármacos desde su teléfono sin desbordamiento horizontal.
  - En la pestaña de edición de `admin/products.tsx`, añadido selector rápido desplegable para teléfonos (`block lg:hidden`) para cambiar de producto sin desplazarse por una columna vertical de 18 elementos.
  - `dashboard.tsx`: Grid de KPIs adaptado a 2 columnas en teléfonos (`grid-cols-2 lg:grid-cols-5`), y grid de 4 fichas operativas ampliado a 4 columnas en 4K (`3xl:grid-cols-4`).
  - `breadcrumbs.tsx`: Prevención de desbordamiento de títulos largos en smartphones mediante truncamiento adaptativo (`truncate max-w-[120px] sm:max-w-none`).
  - `admin/quotes.tsx`, `admin/reports.tsx`, `admin/messages.tsx`, `admin/users.tsx`, `admin/ai.tsx`, `admin/settings.tsx`: Contenedores expandidos para 4K y márgenes táctiles cómodos en teléfonos.
- [x] **Ficha Técnica Médica de Producto (`product-detail.tsx`):**
  - Layout expandido para 4K y márgenes táctiles ajustados para dispositivos móviles.
- [x] **Corrección de Modo Oscuro en Farmacovigilancia (`farmacovigilancia.tsx`):**
  - Incorporadas clases `dark:` en toda la vista de Farmacovigilancia (fondo general, tarjeta principal de reporte, notice sanitario del INH, selectores, campos de texto, botones de severidad y modal/tarjeta de ticket generado exitosamente).
- [x] **Visibilidad Móvil de Farmacovigilancia y Menú Hamburguesa (`booz-layout.tsx`):**
  - Incorporado botón desplegable de menú hamburguesa (`Menu` / `X`) en la barra de navegación superior en pantallas móviles y tablets (`< lg`), desplegando panel con acceso directo a Líneas, Catálogo, Conocimiento, Farmacovigilancia (con badge "Oficial INH") y Consola.
  - Añadido enlace permanente a Farmacovigilancia (`ShieldAlert` - "Vigilancia") en la barra de navegación inferior móvil (`md:hidden`).
  - Botón flotante de WhatsApp habilitado ergonómicamente tanto en móviles (`bottom-20 right-3.5`) como en escritorio (`bottom-6 right-6`).
- [x] **Navegación Interactiva desde Carrito Vacío al Catálogo (`store-cart-drawer.tsx`):**
  - La tarjeta de estado vacío de la tienda ("Tu bolsa está vacía...") y su botón de llamada a la acción son 100% interactivos: al hacer clic o tap, cierran la bolsa y navegan/desplazan suavemente la pantalla hasta la sección `#productos`.
- [x] **Botón de Añadir a la Bolsa en Ficha Médica (`product-detail.tsx`):**
  - Incorporada tarjeta comercial destacada con precio referencial en USD, indicador de stock en planta y botón llamativo `Añadir a la Bolsa de Pedidos`, complementado con botón táctil directo en la columna de imagen/presentación.
- [x] **Vademécum Clínico Imprimible en PDF Oficial (`vademecum-pdf.blade.php` y `product-detail.tsx`):**
  - Desarrollada la vista oficial de Vademécum Clínico y Ficha Técnica Imprimible en PDF bajo el esquema azul corporativo Booz (`#002072`), accesible públicamente vía `/producto/{slug}/vademecum`.
  - Incluye fotografía oficial del envase, especificaciones farmacológicas completas (principios activos, presentación, posología, indicaciones, precauciones, régimen de dispensación, condiciones de almacenamiento, canal oficial de farmacovigilancia INH y firmas de regencia técnica).
  - Añadidos botones de descarga e impresión en PDF en la barra de navegación superior de la ficha y en la tarjeta comercial de `product-detail.tsx`.
- [x] **Verificación Integral y QA:**
  - `npm run build`: 2.762 módulos transformados sin errores en 8.35s.
  - `php artisan test`: 139 tests pasando en verde (556 assertions).
  - OpenSpec: 13/13 especificaciones validadas.

---

## 🛰️ Fase 28: Telemetría Fail-Safe & Mirador Clínico de Lira AI (`/admin/analytics`)
- [x] **Modelo de Datos y Migración (`2026_08_31_000001_create_chat_telemetry_tables.php`):**
  - Tabla `chat_sessions`: `session_uid` único, `first_query`, `peer_hash`, `url_ref`, `turn_count`, `total_latency_ms`, `last_source`, `action`, `suggested_product_ids` JSON y `converted_to_order`.
  - Tabla `chat_messages`: `chat_session_id`, `role`, `content`, `source`, `model`, `latency_ms`, `prompt_tokens`, `completion_tokens`, `disclaimer_shown` y `guardrail_triggered`.
  - Tabla `product_daily_stats`: `product_id`, `date`, `views_count`, `chatbot_mentions_count`, `quote_requests_count` con índice compuesto `UNIQUE(product_id, date)`.
- [x] **Servicio `ChatTelemetryService` con Fail-Safe Isolation:**
  - Persistencia aislada de turnos: una contingencia en base de datos jamás interrumpe la respuesta del asistente virtual ni genera errores al usuario.
  - Medición de latencia de alta resolución y extracción de tokens de Gemini desde `usageMetadata`.
- [x] **Consola Administrativa & Mirador Clínico (`/admin/analytics`):**
  - KPIs en tiempo real (sesiones, mensajes, latencia promedio, tasa Gemini vs. determinista, guardrails activos y tasa de conversión).
  - Gráfico de curvas y tendencias nativo SVG (`TrendChart`) sin librerías externas pesadas.
  - Embudo de conversión paso a paso (`FunnelView`).
  - Modal interactivo de auditoría médica (`ConversationTranscriptModal`) para inspeccionar el diálogo turno a turno.
  - Exportación en streaming a CSV (`/admin/analytics/export-csv`) compatible con Microsoft Excel.
- [x] **Comando de Consolidación Idempotente (`telemetry:rollup`):**
  - Agregación diaria de menciones y cotizaciones por fármaco sin duplicar filas.
- [x] **Verificación Integral y QA:**
  - `npm run build`: 2.766 módulos transformados sin errores en 9.34s.
  - `php artisan test`: 144 tests pasando en verde (588 assertions).
  - OpenSpec: 14/14 especificaciones validadas.

---

## 🎨 Fase 29: Optimización Ergonómica de Ficha de Producto & Tarjeta Dual Lira AI / WhatsApp (`product-detail.tsx`)
- [x] **Rebalanceo de Cuadrícula en PC (Escritorio):**
  - Se eliminó el espacio vacío que quedaba bajo la imagen del medicamento en pantallas de computadora.
  - Las especificaciones clínicas (Indicaciones Terapéuticas, Posología y Modo de Empleo, Advertencias y Garantía de Farmacovigilancia INH) se reposicionaron en la columna izquierda bajo la foto oficial y la presentación (`hidden lg:block`).
  - Ambas columnas (clínica a la izquierda y comercial a la derecha) quedan perfectamente equilibradas en altura y jerarquía visual.
- [x] **Tarjeta Dual de Orientación & Asistencia Inmediata:**
  - Transformada la tarjeta exclusiva de WhatsApp en un centro de orientación con dos opciones claras:
    1. **Botón Lira AI:** Activa el asistente virtual médico 24/7 en un solo clic mediante el evento global `booz:open-lira`.
    2. **Botón WhatsApp Oficial:** Abre el canal directo con el equipo comercial y regencia técnica para cotizaciones al mayor o compras directas.
- [x] **Ergonomía Móvil Preservada:**
  - En teléfonos móviles (`block lg:hidden`), las especificaciones clínicas se ubican al final, manteniendo primero la imagen, el título, el precio, el botón de añadir a la bolsa y la tarjeta dual de consulta.
- [x] **Verificación Integral y QA:**
  - `npm run build`: 2.766 módulos transformados sin errores en 9.88s.
  - `php artisan test`: 144 tests pasando en verde (588 assertions).
  - OpenSpec: 14/14 especificaciones validadas.

---

## 📡 Fase 30: Telemetría Multi-Canal & Rastreo de Intención de WhatsApp
- [x] **Base de Datos y Modelado de Intención (`interaction_events`):**
  - Migración `2026_08_31_000002_create_interaction_events_table.php` ejecutada.
  - Tabla `interaction_events` con campos `event_type`, `channel`, `source`, `product_id`, `session_uid`, `metadata` e índices optimizados.
  - Agregada columna `whatsapp_clicks_count` a `product_daily_stats` para consultas analíticas instantáneas por producto.
  - Modelo `App\Models\InteractionEvent` con scopes de filtrado por canal y fecha.
- [x] **API y Servicio de Telemetría Fail-Safe:**
  - Creado `App\Http\Controllers\Api\TelemetryEventController` con ruta `POST /api/telemetry/event` (exenta de CSRF, con throttle y validación).
  - Método `ChatTelemetryService::recordInteraction()` con captura de excepciones que garantiza que ningún fallo de red o BD interrumpa la navegación del usuario.
- [x] **Frontend Beacon No Bloqueante (`resources/js/lib/telemetry.ts`):**
  - Implementado `trackInteractionEvent()` priorizando `navigator.sendBeacon()` y respaldo con `fetch({ keepalive: true })` (< 3ms de ejecución, invisible al usuario).
  - Integrado en botón *"Atención por WhatsApp"* de la ficha de producto (`product-detail.tsx`).
  - Integrado en botón flotante global de WhatsApp (`booz-layout.tsx`).
  - Integrado en el botón de confirmación de cotización de la bolsa de pedidos (`store-cart-drawer.tsx`).
- [x] **Mirador Administrativo Multi-Canal (`/admin/analytics`):**
  - Nueva cuadrícula de 6 KPIs: Sesiones Lira (Breves vs. Profundas), Clics WhatsApp (Total y Hoy), Cotizaciones en BD, Formularios Web Recibidos, Latencia Lira y Tasa de Conversión.
  - Gráfico `TrendChart` actualizado con línea esmeralda para el volumen diario de intenciones de WhatsApp.
  - Embudo `FunnelView` adaptado para mostrar los 4 escalones del recorrido del paciente/cliente farmacéutico.
- [x] **Consolidación Diaria (`telemetry:rollup`):**
  - Actualizado el comando artisan para totalizar e indexar clics de WhatsApp por medicamento.
- [x] **Verificación Integral y QA:**
  - `php artisan test`: 146 tests pasando en verde (595 assertions).
  - `npm run build`: 2.767 módulos transformados sin errores en 10.30s.
  - OpenSpec: 14/14 especificaciones validadas.

---

## 🌐 Fase 31: Telemetría de Tráfico Servidor & Páginas Vistas (Zero-Latency)
- [x] **Base de Datos y Modelado de Tráfico (`page_views` y `daily_visitors`):**
  - Migración `2026_08_31_000003_create_page_views_and_traffic_tables.php` ejecutada.
  - Tabla `page_views` indexada por fecha y ruta con conteo de vistas e impresiones únicas.
  - Tabla `daily_visitors` con hash anónimo diario `SHA256(IP + UserAgent + Fecha)` para contar personas reales sin almacenar datos personales ni violar privacidad.
  - Modelos `App\Models\PageView` y `App\Models\DailyVisitor`.
- [x] **Terminable Middleware Zero-Latency (`TrackPageViews`):**
  - Creado `App\Http\Middleware\TrackPageViews` que aprovecha el ciclo `terminate()` de Laravel para registrar la visita **después** de que el servidor ya envió todo el HTML al cliente.
  - Cero milisegundos (0.00ms) de sobrecarga para el usuario que navega la web.
  - Clasificador inteligente de secciones (`TrafficTelemetryService`): Home, Ficha de Producto, Vademécum, Farmacovigilancia, Herramientas, Casos Clínicos y Blog.
  - Vinculación automática con `product_daily_stats.views_count` cuando la visita es a una ficha de medicamento.
- [x] **Mirador Administrativo & Embudo Maestro (`/admin/analytics`):**
  - Banner superior de Tráfico Servidor (4 tarjetas: Páginas Vistas, Visitantes Únicos, Fichas de Fármacos, Ratio Catálogo/Visitas).
  - Sección de "Páginas Más Visitadas" en la pestaña de Estado Clínico.
  - Gráfico de curvas `TrendChart` con línea punteada púrpura para el tráfico diario.
  - Embudo Maestro de 5 Etapas en `FunnelView`:
    $$\text{Tráfico Web (Servidor)} \longrightarrow \text{Exploración Catálogo} \longrightarrow \text{Consultas Lira AI} \longrightarrow \text{Intención WhatsApp} \longrightarrow \text{Cotizaciones en BD}$$
- [x] **Verificación Integral y QA:**
  - `php artisan test`: 151 tests pasando en verde (619 assertions).
  - `npm run build`: 2.767 módulos transformados sin errores en 8.54s.
  - OpenSpec: 14/14 especificaciones validadas.

---

## 🐾 Fase 32: Mascota Oficial Lira 3D con Fondo Transparente & Experiencia Visual Mejorada
- [x] **Procesamiento de Imagen con Segmentación de Alta Fidelidad (`u2net`):**
  - Procesada la imagen original entregada por la dirección: `audios_y_material/Lira oficial.jpeg`.
  - Extracción y eliminación completa del fondo blanco y sombras mediante matting alpha sub-píxel, conservando cada detalle del pelaje 3D, orejas azules, medalla oficial grabada "BOOZ", expresión facial sonriente y patitas saludando.
  - Generación de activos optimizados en PNG y WebP de alta velocidad:
    - `public/assets/img/lira_official_transparent.png` y `.webp` (Cuerpo entero transparente).
    - `public/assets/img/lira_head_avatar.png` y `.webp` (Avatar cuadrado centrado 512x512).
    - `public/assets/img/lira_real_head_avatar.png`, `lira_real_head_transparent.png` y `lira_mascot_transparent.png` (Retrocompatibilidad total).
    - Reemplazo y saneamiento del viejo GIF `lira_saludo_animado.gif` (que contenía un patrón de ajedrez gris/blanco artificial).
- [x] **Mejora del Requerimiento & Despliegue en la Interfaz:**
  - **Bento Grid de la Portada (`home.tsx`):** Tarjeta interactiva de Lira con la mascota oficial 3D completa en alta definición, halo de iluminación médica cyan (`drop-shadow-[0_10px_25px_rgba(6,182,212,0.4)]`) y animación hover.
  - **Modal del Asistente Virtual (`lira-assistant-modal.tsx`):**
    - Encabezado renovado con avatar nítido, medalla visible y punto de estado en línea (verde esmeralda pulsante).
    - Tarjeta de Bienvenida Visual: cuando el usuario abre el chat por primera vez, Lira oficial aparece saludando de cuerpo entero junto a un mensaje amigable y orientativo.
  - **Ficha de Producto (`product-detail.tsx`):** Botón "Consultar a Lira AI" en la tarjeta dual con avatar nítido enmarcado en degradado cyan/azul.
  - **Botón Flotante y Barra Móvil (`booz-layout.tsx`):** Integración homogénea de la nueva imagen en escritorio y móviles.
- [x] **Verificación Integral y QA:**
  - `php artisan test`: 151 tests pasando en verde (619 assertions).
  - `npm run build`: 2.767 módulos transformados sin errores en 9.65s.
  - OpenSpec: 14/14 especificaciones validadas.

---

## 🎨 Fase 33: Optimización Cromática y Alto Contraste de Lira AI
- [x] **Desacoplamiento de Fondo y Eliminación de Mimetismo Visual:**
  - Como el personaje Lira comparte los colores corporativos oficiales (`#002072` azul marino y cyan), los fondos oscuros mimetizaban la silueta del personaje reduciendo su impacto.
  - Se sustituyeron los fondos azules planos por podios y pods con **degradado blanco perla luminoso** (`bg-gradient-to-b from-white via-slate-50 to-blue-50`), ribetes en cyan brillante (`border-2 border-cyan-400 dark:border-cyan-300`) y anillos perimetrales reflectantes (`ring-2 ring-white/90`).
  - **Ubicaciones actualizadas:**
    - Barra de navegación móvil inferior (`booz-layout.tsx`).
    - Botón flotante de escritorio junto a WhatsApp (`booz-layout.tsx`).
    - Botón "Consultar a Lira AI" en la Ficha de Producto / PDP (`product-detail.tsx`).
    - Tarjeta "Hola, soy Lira" en el Bento Grid de la Portada (`home.tsx`) con halo multicapa de luz perla y cian claro.
    - Encabezado, tarjeta de bienvenida y miniaturas en los globos de diálogo del modal (`lira-assistant-modal.tsx`).

---

## 📊 Fase 34: Telemetría Expandida, Filtros Dinámicos de Tiempo y Entorno Tecnológico
- [x] **Enriquecimiento del Esquema de Datos (`daily_visitors`):**
  - Migración `2026_08_30_194848_enhance_daily_visitors_table.php` ejecutada.
  - Nuevas columnas analíticas: `browser` (32), `device_type` (32), `os` (32) y `entry_path` (255).
- [x] **Captura Zero-Latency en el Servidor (`TrafficTelemetryService.php`):**
  - Parser ultra-rápido de `User-Agent` basado en expresiones regulares nativas (sin sobrecarga ni dependencias externas).
  - Detección de dispositivos (*Desktop*, *Mobile*, *Tablet*), navegadores (*Chrome*, *Safari*, *Firefox*, *Edge*, *Opera*) y sistemas operativos (*Windows*, *macOS*, *Android*, *iOS*, *Linux*).
  - Registro de la primera ruta de aterrizaje (`entry_path`) de cada visitante diario.
- [x] **Controlador Analítico Flexible (`AdminAnalyticsController.php`):**
  - Soporte de selector dinámico de periodos: `7d` (por defecto), `15d`, `30d`, `6m`, `1y` y `all` (histórico total).
  - Adaptación de resolución temporal: diario para periodos cortos y mensual para periodos extendidos.
  - Métricas agregadas de periodo vs. acumulado histórico para páginas vistas y visitantes únicos.
- [x] **Curva de Tendencias Interactiva (`trend-chart.tsx`):**
  - Selector de rangos temporales en píldoras (`7 Días`, `15 Días`, `1 Mes`, `6 Meses`, `1 Año`, `Histórico`).
  - Leyendas activas: posibilidad de alternar con un clic la visibilidad de cada serie (*Páginas Vistas*, *Sesiones Lira*, *Gemini AI*, *Motor Local*, *WhatsApp*).
- [x] **Pestaña Analítica "Tráfico, Secciones & Dispositivos" (`analytics.tsx`):**
  - Tarjetas comparativas del periodo activo frente al acumulado histórico.
  - Gráfico de barras de porcentaje de las secciones más visitadas (*Inicio*, *Catálogo*, *Vademécum*, *Farmacovigilancia*, etc.).
  - Matriz de entorno tecnológico (proporción de dispositivos y navegadores).
  - Top 5 de páginas de entrada (Landing / Entry Paths).
- [x] **Verificación Integral y QA:**
  - `npm run build`: 2.767 módulos compilados limpiamente sin advertencias en 8.78s.

---

## 💎 Fase 35: Showcase Hero Principal con Línea Oficial Booz Lab de Alta Potencia Visual
- [x] **Sustitución de Imagen Genérica de Stock:**
  - Se retiró la imagen anterior que mostraba recipientes genéricos no relacionados con la identidad de la marca.
- [x] **Generación y Despliegue de Composición Farmacéutica Oficial:**
  - Basada en las fotos reales de planta (`Foto_Muestra_Linea_12_Estuches_Dermatologicos.jpeg` y `Foto_Muestra_Tubo_Betamer_Crema_20g.jpeg`).
  - Renderizado hiperrealista de estudio clínico en alta resolución (8K) con estuches médicos de **Bactrocis, Betamer, Aciclomer, Amikacis y Quadrimer**, acompañados del tubo oficial Betamer con tapa terracota y logotipo oficial Booz.
  - Dispuestos sobre pedestal médico flotante de cristal esmerilado con iluminación perimetral azul y cian reflectante de laboratorio tecnológico.
  - Desplegado en `public/assets/img/hero_products.png` y vinculado al contenedor dinámico 3D de la portada (`home.tsx`) con bordes suaves `rounded-2xl`, zoom interactivo con hover y badge de *Calidad Certificada - Valle de Guanape, Venezuela*.
- [x] **Verificación Integral y QA:**
  - `npm run build`: 2.767 módulos transformados con éxito en 8.71s.





