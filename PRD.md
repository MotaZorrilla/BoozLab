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

---

## 🚫 5. Fuera del Alcance (Out of Scope para el MVP)

*   Venta libre directa desregulada de antibióticos (Moxifloxacina, Amikacina) mediante pasarela de pago sin récipe médico previo. La adquisición se gestiona vía contacto con farmacias autorizadas y distribuidores.
*   Conexión en tiempo real con sistemas ERP externos de inventario hospitalario.

---

## 📊 6. Métricas Actuales del Sistema
*   **Vademécum Registrado:** 18 productos clasificados en sus 4 líneas terapéuticas oficiales.
*   **Aseguramiento de Calidad:** 133 tests automatizados pasando en verde (536 assertions) en PHPUnit 11.
*   **Especificaciones Formales:** 12 especificaciones OpenSpec en Gherkin BDD 100% validadas.

