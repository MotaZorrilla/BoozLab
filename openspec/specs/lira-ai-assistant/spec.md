# Lira Virtual AI Assistant Specification

## Purpose
Proveer orientación farmacéutica digital a pacientes y profesionales mediante la asistente virtual "Lira", garantizando apego irrestricto a la política de No-Automedicación y conectividad con el vademécum oficial.

## Requirements

### Requirement: Consulta de Catálogo y Principios Activos
El asistente SHALL procesar consultas sobre medicamentos, principios activos y presentaciones utilizando el catálogo oficial de Booz Laboratorio respaldado por Google Gemini.

#### Scenario: Búsqueda de principio activo
- **WHEN** un usuario consulta "¿Para qué sirve Bacumer?" o "¿Tienen tratamiento para pie diabético?"
- **THEN** Lira responde con la información técnica oficial del producto y genera botones de acceso directo a la ficha médica

### Requirement: Guardrail Ético Anti-Automedicación
El sistema SHALL prohibir terminantemente emitir recetas o alentar el uso de fármacos sin supervisión profesional médica.

#### Scenario: Consulta sobre dolencias o síntomas
- **WHEN** el usuario pregunta qué tomar o aplicarse ante un dolor, infección o herida
- **THEN** el sistema añade de forma mandatoria la advertencia sanitaria de acudir al médico especialista o farmacéutico tratante

### Requirement: Identidad Visual y Avatar Transparente
La interfaz del asistente SHALL mostrar la imagen oficial de Lira (perrita con bata de laboratorio) con fondo 100% transparente en el botón de navegación, botón flotante y cabecera de la modal.

#### Scenario: Apertura de la modal de Lira
- **WHEN** el usuario presiona "Habla con Lira"
- **THEN** la modal se despliega mostrando el avatar de Lira sin recuadros blancos de fondo y con los botones de consulta rápida ajustados sin desbordamiento
