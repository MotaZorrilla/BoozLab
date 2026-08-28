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

### 4.3 Módulo Administrativo de Catálogo - CMS (P0 - Crítico)
*   **CRUD de Productos en Tiempo Real:** Interfaz intuitiva en el panel administrativo para agregar nuevos medicamentos/cosméticos, editar información posológica, actualizar imágenes y activar/desactivar productos.
*   **Gestión de Contenidos:** Administración de testimonios médicos y preguntas frecuentes (FAQs).

### 4.4 Asistente Virtual IA "Lira" con Guardrails Éticos (P1 - Alto)
*   **Integración Multimedia:** Incorporación de la mascota Lira con animación de video de fondo transparente.
*   **Política de Cero Automedicación:** El asistente proporciona información educativa basada en el prospecto oficial, pero **nunca prescribe ni diagnostica**. Incluye disclaimers obligatorios recomendando la consulta médica o farmacéutica.

### 4.5 Calculadora Pediátrica Clínica (P1 - Alto)
*   Herramienta interactiva para profesionales de la salud y padres que calcula dosis recomendadas en base al peso (kg) o edad del paciente según las reglas de Clark y regímenes de mg/kg/día.

---

## 🚫 5. Fuera del Alcance (Out of Scope para el MVP)

*   Venta libre directa desregulada de antibióticos (Moxifloxacina, Amikacina) mediante pasarela de pago sin récipe médico previo. La adquisición se gestiona vía contacto con farmacias autorizadas y distribuidores.
*   Conexión en tiempo real con sistemas ERP externos de inventario hospitalario.
