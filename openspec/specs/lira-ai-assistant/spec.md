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

### Requirement: Derivación y Captura de Mensajes para la Administración
El asistente SHALL incentivar la comunicación directa con el equipo administrativo, permitiendo al usuario ingresar sus datos de contacto en un formulario interactivo integrado en el chat y despachando la notificación inmediata a la bandeja del Dashboard administrativo.

#### Scenario: Solicitud de contacto con administradores
- **GIVEN** el modal de Lira abierto
- **WHEN** el usuario indica que desea hablar con el administrador o presiona "💬 Contactar al Administrador"
- **THEN** Lira despliega un formulario interactivo embebido para capturar Nombre, Teléfono/WhatsApp, Email y Consulta
- **AND** al enviar el formulario se registra en el sistema con `source: 'lira_chatbot'`, emitiendo alerta visual en el Dashboard y confirmando al usuario en el chat.
