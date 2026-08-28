# Lira AI and Dynamic Clinical Corpus Specification

## Purpose
Proveer un asistente virtual inteligente (Lira) impulsado por Google Gemini y alimentado dinámicamente con el vademécum de los 18 productos farmacéuticos de Booz Laboratorio clasificados por sus 4 líneas terapéuticas, con administración segura de credenciales y guardrails inmutables de Cero Automedicación.

## Requirements

### Requirement: Inyección Dinámica del Catálogo Agrupado por Líneas
El sistema SHALL construir en tiempo de ejecución el contexto de conocimientos de Lira estructurando los 18 fármacos activos clasificados bajo sus 4 líneas terapéuticas (01 Cuidado de la piel, 02 Tratamiento tópico, 03 Salud y bienestar, 04 Cuidado especializado) con sus principios activos y presentaciones.

#### Scenario: Consulta a Lira con catálogo actualizado
- **WHEN** un usuario realiza una consulta sobre formulaciones farmacéuticas a través de `/api/chatbot/query`
- **THEN** el sistema inyecta en el prompt de sistema los 18 productos agrupados por línea terapéutica recuperados desde la base de datos

### Requirement: Guardrails Sanitarios Inmutables
El sistema SHALL forzar la inclusión de directrices éticas y sanitarias inalterables en todas las interacciones con el LLM, prohibiendo la prescripción médica directa y advirtiendo sobre medicamentos que requieren récipe.

#### Scenario: Pregunta médica sobre tratamiento o dolor
- **WHEN** el usuario pregunta qué medicamento tomar para una afección o síntoma personal
- **THEN** la respuesta orienta sobre las opciones del catálogo pero enfatiza obligatoriamente la necesidad de evaluación médica profesional y el aviso de no automedicación

### Requirement: Gestión Cifrada y Enmascaramiento de Credenciales
El sistema SHALL almacenar la API Key de Google Gemini cifrada en la base de datos y presentarla de manera enmascarada en la consola administrativa de IA.

#### Scenario: Visualización y actualización de la clave de Gemini
- **WHEN** el Super Administrador accede a `/admin/ai`
- **THEN** la clave activa se visualiza con caracteres de ofuscación impidiendo su exposición en texto plano
