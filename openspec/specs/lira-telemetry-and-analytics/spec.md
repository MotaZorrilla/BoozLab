# Lira AI Telemetry & Conversation Monitoring Specification

## Purpose
Proveer un sistema de registro integral, no bloqueante y fail-safe de todas las interacciones del asistente virtual Lira AI, permitiendo a la dirección técnica y médica de Booz Laboratorio auditar consultas, medir tiempos de respuesta, supervisar la contención de guardrails clínicos y analizar la conversión de orientaciones farmacéuticas hacia cotizaciones formales.

## Requirements

### Requirement: Registro y Auditoría Fail-Safe de Conversaciones
El sistema SHALL capturar y persistir en las tablas `chat_sessions` y `chat_messages` cada interacción realizada en `/api/chatbot`, registrando identificador único de sesión, turnos, latencia en milisegundos, fuente de respuesta, tokens y guardrails disparados, garantizando aislamiento de fallos ante cualquier contingencia de base de datos.

#### Scenario: Registro exitoso de sesión e interacción de usuario
- **WHEN** un visitante envía una consulta al endpoint `/api/chatbot` con un `session_uid`
- **THEN** el sistema persiste la sesión y crea dos registros de mensaje (uno de rol usuario y otro de rol asistente con la fuente y latencia calculadas)

#### Scenario: Aislamiento fail-safe ante fallos de persistencia
- **WHEN** ocurre una excepción imprevista durante el registro de telemetría
- **THEN** la excepción es capturada silenciosamente en logs y el usuario recibe su respuesta clínica con estado HTTP 200 sin interrupciones

### Requirement: Mirador y Filtro de Sesiones en Consola Administrativa
El panel administrativo `/admin/analytics` SHALL proveer un tablero con KPIs en tiempo real (sesiones, mensajes, latencia promedio, tasa Gemini vs. determinista, guardrails activos y conversión) y una interfaz de búsqueda para inspeccionar el historial y abrir la transcripción completa turno a turno.

#### Scenario: Visualización del tablero de telemetría por personal autorizado
- **GIVEN** un usuario autenticado con rol `super_admin` o `director_tecnico`
- **WHEN** accede a la ruta `/admin/analytics`
- **THEN** el sistema renderiza los KPIs, el gráfico cronológico de tendencias y la tabla/tarjetas de sesiones con buscador interactivo

### Requirement: Exportación de Datos en Streaming CSV
El sistema SHALL permitir la descarga directa de un archivo CSV estructurado bajo la ruta `/admin/analytics/export-csv` conteniendo las métricas acumuladas de cada sesión para auditoría médica en hojas de cálculo.

#### Scenario: Descarga de reporte CSV de telemetría
- **WHEN** un administrador presiona el botón "Exportar CSV"
- **THEN** el servidor responde con una descarga de flujo streamed en formato CSV con cabecera UTF-8 BOM y delimitador estándar

### Requirement: Consolidación Diaria de Telemetría (Rollup)
El sistema SHALL proveer un comando artisan `telemetry:rollup` idempotente para calcular y almacenar en `product_daily_stats` el total de menciones y solicitudes de cotización agrupadas por producto y fecha.

#### Scenario: Ejecución de comando de consolidación diaria
- **WHEN** se ejecuta `php artisan telemetry:rollup`
- **THEN** el comando procesa los productos activos y actualiza o crea las estadísticas del día sin duplicar registros
