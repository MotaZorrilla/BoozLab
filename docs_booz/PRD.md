# 📋 Documento de Requisitos del Producto (PRD) - Booz Laboratorio

Este documento especifica los requisitos de producto, diseño y arquitectura técnica para la plataforma tecnológica **Booz Laboratorio (Clinical AI Platform)**.

---

## 📖 1. Introducción y Propósito del Producto

**Booz Laboratorio** es una plataforma farmacéutica y clínica de vanguardia diseñada para comunicar la autoridad científica, el portafolio de productos y los servicios de salud de **BOOZ LABORATORIO VGME, C.A.** hacia la comunidad médica, farmacias aliadas, distribuidores y pacientes.

### Identidad Corporativa y Legal Oficial
*   **Razón Social:** BOOZ LABORATORIO VGME, C.A.
*   **RIF:** J-40906185-0
*   **Domicilio Fiscal:** Av. Hospital, cruce con Troncal 11, Local N° 2, Sector El Placer, Valle de Guanape, Edo. Anzoátegui, Zona Postal 6032, Venezuela.
*   **Farmacéutica Patrocinante:** Farm. Merbry Pérez Malavé.
*   **Redes Oficiales Unificadas:** `@booz.laboratorio` / `www.boozlaboratorio.com`
*   **Slogan Oficial:** *"La ciencia que transforma el cuidado."*

---

## 🎨 2. Sistema de Identidad Visual y Diseño (Design System)

*   **Paleta de Colores Oficial (Certificada en Estuches y Empaques):**
    *   🔵 **Azul Profundo Booz** (PANTONE 2747 C / `#0F2557` - `#1E3A8A`): Color principal de estructura, sobriedad y respaldo farmacéutico.
    *   🍷 **Borgoña / Vinotinto Booz** (PANTONE 506 C / `#800020` - `#831843`): Color secundario distintivo de las presentaciones clínicas.
    *   🔬 **Cian High-Tech** (`#06B6D4` / `#0EA5E9`): Enlaces activos, acentos de innovación e inteligencia artificial.
    *   ⚪ **Blanco Puro y Gris Humo** (`#FFFFFF` / `#F8FAFC`): Fondos clínicos pulcros y tarjetas de contenido legibles.
*   **Tipografía Oficial:** `Instrument Sans` / `Montserrat` (geométrica, moderna y de máxima legibilidad).
*   **Mascota Digital Oficial ("Lira"):** Personaje canino 3D en bata médica y orejas azules, diseñado para humanizar la marca, orientar al usuario en el catálogo y actuar como avatar interactivo del Asistente Virtual IA.

### 2.1 Arquitectura de Layouts UI (Estrategia de Dos Llaves)
*   🔑 **`BoozLayout` (Portal Público & Clínico):** Diseñado para pacientes y profesionales. Navbar clínica con acceso rápido a las 4 líneas de productos, botón flotante de WhatsApp, buscador instantáneo y asistente Lira integrado con animación transparente.
*   🔑 **`BoozAdminLayout` (Consola Administrativa):** Panel de alta densidad para la dirección del laboratorio. Gestión en tiempo real del catálogo de productos, visualización de métricas y bandeja de entrada de reportes de farmacovigilancia.

---

## 👥 3. Perfiles de Usuario y Roles (RBAC)

1.  **Director Técnico / Administrador:** Control total del sistema. Gestión del catálogo de productos (CRUD), aprobación de contenidos, supervisión de métricas y exportación de reportes sanitarios.
2.  **Farmacéutico Patrocinante:** Auditoría de lotes, revisión de reportes de farmacovigilancia y validación técnica de prospectos.
3.  **Médico / Especialista Clínico:** Acceso a evidencia científica, fichas técnicas completas y solicitud de muestras médicas.
4.  **Visitador Médico / Representante Comercial:** Consulta de presentaciones comerciales, estuches y materiales promocionales.
5.  **Paciente / Usuario Final:** Consulta libre de productos, acceso a la calculadora pediátrica, chat informativo con Lira y reporte de incidencias/quejas.

---

## ⚙️ 4. Módulos y Requisitos Funcionales

### 4.1 Módulo de Catálogo y Páginas Dedicadas por Producto (P0 - Crítico)
*   **Clasificación por 4 Líneas Terapéuticas Oficiales:**
    1.  *Línea 01: Cuidado de la piel* (Calamicis, Beducis, Hidramer, Centellacis).
    2.  *Línea 02: Tratamiento tópico* (Bacumer, Gentamicis, Amikacis, Betamer, Betasalicis, Betagemer, Quadrimer, Micosmer, Labicis).
    3.  *Línea 03: Salud y bienestar* (Cevitmer Vitamina C, Booz Sport, L-Fortex).
    4.  *Línea 04: Cuidado especializado* (Bactrocis Moxifloxacina para Pie Diabético y regeneración tisular).
*   **Páginas Dedicadas por Producto (PDP - `/producto/{slug}`):**
    *   Espacio individualizado para cada producto con fotografía de estuche oficial, composición cuali-cuantitativa, indicaciones clínicas, posología y precauciones.
    *   Botón directo de **WhatsApp con mensaje preconfigurado** específico para ese producto.
    *   Módulo de productos relacionados de la misma línea terapéutica.
    *   Metadatos OpenGraph para compartir en redes sociales y mensajería con imagen y descripción.

### 4.2 Módulo de Farmacovigilancia y Quejas/Reclamos (P0 - Exigencia Sanitaria INH)
*   **Canal Oficial Sanitario:** Formulario público para el reporte de sospechas de reacciones adversas a medicamentos (RAM) y quejas de calidad de lote, según normativa del Instituto Nacional de Higiene "Rafael Rangel".
*   **Datos Requeridos:** Nombre del producto, número de lote, fecha de vencimiento, descripción de la reacción adversa/falla, severidad (`Leve`, `Moderada`, `Grave`) y datos de contacto.
*   **Generación de Ticket:** Asignación automática de código de seguimiento correlativo y persistencia en base de datos.

### 4.3 Módulo Administrativo de Catálogo Farmacéutico & Editor de Fichas Médicas (P0 - Crítico)
*   **Gestión Integral de Catálogo (`/admin/products`):** Filtros directos por los nombres oficiales de las líneas (*Cuidado de la piel*, *Tratamiento tópico*, *Salud y bienestar*, *Cuidado especializado*), tabla con columnas independientes para **Producto** y **Presentación**, miniaturas fotográficas y alternancia rápida de disponibilidad.
*   **Editor Integral de Fichas Médicas & Landing Page:** Interfaz Master-Detail que permite seleccionar cualquiera de los 18 fármacos y editar en vivo sus fotos (galería de miniaturas en 1-clic), indicaciones clínicas, posología, contraindicaciones, alertas sanitarias y textos destacados visibles en `/productos/{slug}`.
*   **Gestión de Contenidos:** Administración de testimonios médicos y preguntas frecuentes (FAQs).

### 4.4 Asistente Virtual IA "Lira" con Guardrails Éticos (P1 - Alto)
*   **Integración Multimedia:** Incorporación de la mascota Lira con animación interactiva.
*   **Política de Cero Automedicación:** El asistente proporciona información educativa basada en el prospecto oficial, pero **nunca prescribe ni diagnostica**. Incluye disclaimers obligatorios recomendando la consulta médica o farmacéutica.

### 4.5 Calculadora Pediátrica Clínica (P1 - Alto)
*   Herramienta interactiva para profesionales de la salud y padres que calcula dosis recomendadas en base al peso (kg) o edad del paciente según las reglas de Clark y regímenes de mg/kg/día.

### 4.6 Tienda Virtual, Bolsa de Cotizaciones & Despacho Comercial por WhatsApp (P0 - Crítico)
*   **Bolsa de Pedidos Interactiva:** Carrito accesible en todas las vistas con selector de perfil de solicitante (*Paciente Particular*, *Farmacia Aliada*, *Clínica / Hospital / Médico*, *Distribuidor B2B*).
*   **Integración WhatsApp Inteligente:** Generación automática de mensaje estructurado con cabecera y pie configurables, cálculo del total en $ USD y persistencia en backend para auditoría de demanda.
*   **Administrador de Tienda Virtual (`/admin/quotes`):** CRUD de cotizaciones, creación de cotizaciones manuales para pedidos por teléfono/planta, control de unidades disponibles y emisión de Comprobante Oficial Imprimible (`BOOZ-COT-YYYY-XXXX`).

### 4.7 Consola de Administración Farmacéutica & Sistema RBAC (P0 - Crítico)
*   **Arquitectura Modular:** Rutas dedicadas con navegación en Sidebar (`/admin/products`, `/admin/reports`, `/admin/messages`, `/admin/quotes`, `/admin/users`, `/admin/ai`, `/admin/settings`).
*   **Control de Acceso Basado en Roles:** Matriz de permisos estricta con 4 roles (*Super Administrador*, *Director Técnico*, *Gestor Comercial*, *Oficial de Farmacovigilancia*).
*   **Configuración Dinámica de WhatsApp:** Centralización del número comercial, plantillas de mensajes y datos de planta en Valle de Guanape vía `system_settings`.

### 4.8 Centro de Entrenamiento Documental RAG y Guardrails Sanitarios de Lira AI (P0 - Crítico)
*   **Base de Conocimiento Documental (RAG):** Carga y administración de documentos técnicos (`AiKnowledgeDocument`) para entrenar a Lira:
    1. *Vademécum Maestro & Fórmulas de los 18 Productos Oficiales de Booz Laboratorio*.
    2. *Protocolo Operativo Estándar de Farmacovigilancia INH Rafael Rangel*.
    3. *Manual de Cotizaciones, Venta Institucional y Logística de Despacho*.
    4. *Guía de Trato, Empatía y Protocolos de Comunicación de Lira AI*.
*   **Subida de Archivos:** Soporte para subir archivos `.txt`, `.md`, `.json`, `.csv` o redactar textos clínicos directamente en la consola.
*   **Gestor de Guardrails Sanitarios (`AiGuardrail`):** Definición de reglas de contención (*Bloqueo Estricto*, *Advertencia Sanitaria Obligatoria*, *Derivación a Soporte Humano*) con protección de reglas estructurales de sistema.
*   **Simulador Playground:** Entorno interactivo para validar la inferencia de Lira en milisegundos con el corpus y guardrails activos.

### 4.9 Experiencia de Catálogo en Landing Page (P0 - Crítico)
*   **Carrusel Infinito con Efecto Peek:** Visualización fluida con vislumbre lateral de tarjetas adyacentes (~5.5% en desktop, ~3.5% en tablet, ~9% en móvil) para orientar al usuario hacia el desplazamiento continuo sin cortes.
*   **Soporte Gestual Nativo:** Control táctil (swipe) para dispositivos móviles y botones flotantes circulares (`ChevronLeft`/`ChevronRight`) con barra de indicadores numéricos y dots interactivos.
*   **Tarjeta de Producto 100% Clickeable:** Todo el marco de la tarjeta enlaza directamente a la Ficha Técnica Médica (`/producto/{slug}`) con micro-interacciones sutiles de hover y escalado de fotografía.
*   **Desincorporación de WhatsApp en Tarjeta & Reubicación de Pedido:** Botón directo a WhatsApp retirado de las tarjetas para descongestionar la vista (canal centralizado en la trinidad flotante y en la bolsa de cotizaciones). Botón "+ Pedido" reposicionado al pie con aislamiento de propagación de eventos (`stopPropagation`).
*   **Transición Suave entre Filtros:** Desvanecimiento suave (fade de 220ms) al alternar entre líneas terapéuticas y necesidades clínicas para eliminar saltos visuales bruscos.

### 4.10 Navegación Esencial y Experiencia de Usuario Pulcra (P0 - Crítico)
*   **Navbar Depurado:** Encabezado limpio "BOOZ LABORATORIO" y menú esencial reducido a exactamente 4 accesos directos: *Líneas* (`/#lineas`), *Catálogo* (`/#productos`), *Conocimiento* (`/#conocimiento`) y *Farmacovigilancia* (`/farmacovigilancia`).
*   **Buscador Minimalista (Lupa):** Conversión de la barra de búsqueda ancha en un botón icónico de lupa (`Search`) con touch target ergonómico que despliega el modal de búsqueda rápida con atajo `Ctrl+K`.
*   **Reubicación de la Calculadora Pediátrica:** Traslado de la herramienta médica al pie de página (columna "Canal Regulatorio & Herramientas") con icono `Sparkles`, preservando acceso permanente sin recargar la cabecera.
*   **Acceso a "Consola":** Modernización del botón "Admin" a **"Consola"** con icono `ShieldCheck` y pulso activo verde esmeralda, sincronizado tanto en la barra superior como en la barra inferior móvil.

### 4.11 Autenticación Corporativa y Seguridad Administrativa (P0 - Crítico)
*   **Login Unificado con `BoozLayout`:** Pantalla de inicio de sesión (`/login`) enmarcada bajo la plantilla institucional `BoozLayout`, con selector de tema claro/oscuro y tarjeta de acceso clínico.
*   **Supresión de Autoregistro Público:** Eliminación definitiva del enlace público "Sign up" para prevenir registros no autorizados de terceros.
*   **Alta Interna Exclusiva para Superadmin:** Botón destacado "Nuevo Registro / Usuario" en la cabecera del Dashboard (`/dashboard`) que dirige a `/admin/users?create=1`, desplegando el modal interactivo con asignación obligatoria de los 4 roles oficiales del laboratorio.

### 4.12 Segmentación Multicanal de Telefonía y Presencia Digital (P0 - Crítico)
*   **Segmentación Multicanal de Contacto:** Gestión diferenciada en `system_settings` y `/admin/settings` para 3 líneas operativas:
    1. *WhatsApp de Atención General y Consultas:* botón flotante público (`whatsapp_contact_phone`).
    2. *WhatsApp de Ventas y Pedidos:* despacho automatizado de cotizaciones desde la tienda virtual (`whatsapp_sales_phone`).
    3. *Central Telefónica de Planta:* enlace directo de llamada telefónica institucional (`company_phone`).
*   **Redes Sociales Oficiales Unificadas:** Homogeneización de los 4 canales corporativos en el footer bajo el identificador oficial `@booz.laboratorio` (Instagram, Facebook, YouTube y TikTok).
*   **FAQ Comercial al Mayor:** Incorporación de pregunta frecuente institucional para droguerías, farmacias independientes y clínicas sobre pedidos por volumen y logística desde Valle de Guanape.

### 4.13 Calculadora Pediátrica Clínica & Servicio Desacoplado LiraAiService (P0 - Crítico)
*   **Motor Pediátrico Clínico:** Sustitución de la lógica simulada "15mg/kg" por un motor reactivo de 3 métodos matemáticos oficiales: Regla de Clark (\(D_{ped} = (P_{kg}/70) \times D_{adulto}\)), Régimen Ponderado diario fraccionado por tomas (\(mg/kg/día\)) y Regla de Young (\(D_{ped} = [E_{años}/(E_{años}+12)] \times D_{adulto}\)).
*   **Desacoplamiento RAG en `LiraAiService`:** Centralización de las llamadas a Google Gemini (`gemini-2.5-flash`) y construcción dinámica del vademécum, documentos RAG y guardrails sanitarios.
*   **Deshardcodeo Dinámico de Lira:** Resolución en tiempo real de números de WhatsApp, RIF, redes sociales, direcciones físicas y disclaimer legal desde `SettingService` y base de datos.

### 4.14 Arquitectura Responsiva Tri-Nivel (Móvil, 1080p y 4K) (P0 - Crítico)
*   **Contenedores Fluidos y Breakpoints Oficiales:** Definición de breakpoints formales en CSS/Tailwind (`2xl` a 1536px y `3xl` a 1920px) con expansión progresiva desde `max-w-7xl` hasta `2xl:max-w-[1536px]` y `3xl:max-w-[1840px]`.
*   **Consola Administrativa Táctil:** En pantallas móviles (`< 768px`), las tablas complejas de 10 columnas alternan a **Tarjetas Móviles de Gestión**, permitiendo buscar medicamentos, alternar disponibilidad y abrir editores sin desbordamientos horizontales.
*   **Tienda Móvil a Pantalla Completa:** En smartphones, el catálogo ofrece una vista de tienda virtual en 2 columnas compactas y el drawer de pedidos aprovecha el 100% del ancho del viewport (`w-full`) con margen de seguridad inferior (`pb-safe`).

### 4.15 Ficha Técnica & Vademécum Oficial Imprimible en PDF (P0 - Crítico)
*   **Ruta Pública Imprimible (`/producto/{slug}/vademecum`):** Documento oficial bajo el esquema cromático azul Booz (`#002072`), con fotografía en alta resolución del medicamento, especificaciones farmacológicas completas, condiciones de almacenamiento, advertencias sanitarias y protocolo oficial de Farmacovigilancia INH.
*   **Acciones Directas en Ficha Médica (`product-detail.tsx`):** Botón directo "Vademécum PDF" en la cabecera y botón destacado "Descargar Ficha Técnica & Vademécum (PDF Oficial)" en la tarjeta comercial del producto, más botones para añadir a la bolsa en un solo toque.

### 4.16 Farmacovigilancia 100% Dark Mode & Menú Hamburguesa Móvil (P0 - Crítico)
*   **Soporte Integral de Modo Oscuro en `/farmacovigilancia`:** Adaptación visual de fondos (`dark:bg-[#070C18]`), tarjetas de reporte (`dark:bg-[#0D172E]`), avisos del INH y formulario de ticket de confirmación.
*   **Menú Móvil Desplegable & Barra Fija con Vigilancia:** Cabecera con menú hamburguesa en smartphones y acceso permanente con icono `ShieldAlert` ("Vigilancia") en la barra inferior móvil.
*   **Navegación Interactiva desde Bolsa Vacía:** El mensaje de estado vacío de la tienda ("Tu bolsa está vacía...") es interactivo y cierra el panel trasladando suavemente la vista a `#productos`.

---

## 🚫 5. Fuera del Alcance (Out of Scope para el MVP)

*   Venta libre directa desregulada de antibióticos (Moxifloxacina, Amikacina) mediante pasarela de pago sin récipe médico previo. La adquisición se gestiona vía contacto con farmacias autorizadas y distribuidores.
*   Conexión en tiempo real con sistemas ERP externos de inventario hospitalario.

---

## 📊 6. Métricas Actuales del Sistema
*   **Vademécum Registrado:** 18 productos clasificados en sus 4 líneas terapéuticas oficiales.
*   **Aseguramiento de Calidad:** 139 tests automatizados pasando en verde (556 assertions) en PHPUnit 11.
*   **Especificaciones Formales:** 13 especificaciones OpenSpec en Gherkin BDD 100% validadas.



