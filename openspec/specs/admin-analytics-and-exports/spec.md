# Admin Analytics, Exports and Regulatory Alerting Specification

## Purpose
Proveer a la Dirección Técnica y Comercial de Booz Laboratorio herramientas avanzadas de auditoría sanitaria, exportación masiva de datos (CSV/Excel), generación de actas oficiales imprimibles para el INH y analítica en tiempo real de demanda y conversión del catálogo.

## Requirements

### Requirement: Exportación de Reportes de Farmacovigilancia y Mensajes en CSV
El sistema SHALL permitir a los usuarios administradores exportar el histórico completo de reportes de farmacovigilancia y mensajes/leads de Lira en formato CSV con codificación UTF-8 BOM compatible con Microsoft Excel.

#### Scenario: Descarga de archivo CSV de farmacovigilancia
- **GIVEN** un usuario autenticado con privilegios de administrador
- **WHEN** solicita la ruta `GET /admin/reports/export-csv`
- **THEN** el sistema responde con una descarga de archivo `text/csv` que contiene cabeceras oficiales (ticket, producto, lote, vencimiento, severidad, reportante, reacción, dictamen) y codificación UTF-8 BOM

#### Scenario: Descarga de archivo CSV de mensajes y leads
- **GIVEN** un usuario autenticado con privilegios de administrador
- **WHEN** solicita la ruta `GET /admin/messages/export-csv`
- **THEN** el sistema responde con una descarga de archivo `text/csv` con datos de contacto, origen (Lira AI vs Web) y dictamen administrativo

### Requirement: Generación de Acta Oficial Imprimible para Auditoría Sanitaria INH
El sistema SHALL proveer una vista web estandarizada bajo `/admin/reports/{report}/print` diseñada con membrete legal de Booz Laboratorio VGME C.A., RIF J-40906185-0, ticket correlativo, datos del producto/lote, dictamen técnico y firmas requeridas por el Instituto Nacional de Higiene "Rafael Rangel".

#### Scenario: Visualización del acta sanitaria imprimible
- **GIVEN** un reporte de farmacovigilancia existente
- **WHEN** el administrador accede a `/admin/reports/{report}/print`
- **THEN** se renderiza la vista clínica oficial con estilos de impresión `@media print` y botón para impresión o guardado como PDF en un clic

### Requirement: Despacho Automatizado de Alertas Administrativas
El sistema SHALL despachar notificaciones automáticas vía correo electrónico (y webhook configurable opcional) cada vez que se registre un reporte de farmacovigilancia o un nuevo lead desde Lira AI, priorizando visualmente los reportes de severidad Grave o Moderada.

#### Scenario: Radicación de reporte grave de farmacovigilancia
- **WHEN** un profesional o paciente envía un reporte con severidad "Grave" o "Moderada"
- **THEN** el sistema envía un correo de alerta sanitaria con asunto destacado `🚨 [URGENTE INH]` al correo administrativo configurado

### Requirement: Métricas de Demanda y Conversión del Catálogo
El sistema SHALL registrar y agregar contadores de vistas de fichas técnicas (`views_count`), consultas de productos guiadas por Lira AI (`chatbot_inquiries_count`) y unidades solicitadas en cotizaciones de WhatsApp (`quote_inquiries_count`), exponiéndolos en la pestaña "Analítica & Demanda" del Dashboard.

#### Scenario: Incremento de analítica ante interacción de usuario
- **WHEN** un usuario visita `/producto/{slug}` o agrega unidades a una cotización comercial
- **THEN** los contadores asociados al producto se incrementan de forma consistente en la base de datos y se reflejan en el ranking del Dashboard
