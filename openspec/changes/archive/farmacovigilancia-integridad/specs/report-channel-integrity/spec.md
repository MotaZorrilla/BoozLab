## Purpose

Garantiza que los canales de reporte farmacovigilancia y consulta del sitio
público persistan en base de datos con identificadores correlativos únicos, y que
la suite de pruebas sea determinista sin dependencia de servicios externos.

## ADDED Requirements

### Requirement: El formulario del home persiste reportes de farmacovigilancia
El sistema SHALL permitir enviar un reporte de farmacovigilancia desde el bloque
"Reportar Evento" del home, persistirlo a través del endpoint oficial y mostrar el
mensaje de éxito únicamente si la persistencia fue confirmada; nunca un éxito ficticio.

#### Scenario: Notificador envía reporte válido desde el home
- **WHEN** un usuario completa nombre, contacto, producto, detalles del evento y envía
- **THEN** el sistema persiste el reporte con estado Pendiente y confirma con mensaje de éxito

#### Scenario: Reporte inválido o sin conexión desde el home
- **WHEN** el envío falla validación, conexión o el backend rechaza el reporte
- **THEN** el sistema NO muestra el mensaje de éxito e indica el error al usuario

### Requirement: Consultas y solicitudes comerciales persisten como mensajes
El sistema SHALL ofrecer un endpoint que persista consultas, solicitudes
institucionales y mensajes comerciales del home en la tabla `messages` con estado Pendiente.

#### Scenario: Envío de consulta desde el home
- **WHEN** un usuario envía una consulta válida sobre un producto
- **THEN** el sistema persiste el mensaje con tipo `consulta` y estado Pendiente

#### Scenario: Tipo de mensaje inválido
- **WHEN** el tipo de mensaje no pertenece a `consulta|reportar|contacto`
- **THEN** el sistema responde HTTP 422 con errores de validación

### Requirement: Tickets correlativos atómicos
El sistema SHALL generar números de ticket únicos `BOOZ-FV-YYYY-NNNN` de forma
atómica, derivando el siguiente correlativo del último ticket del año dentro de una
transacción y reintentando ante colisión con el índice único.

#### Scenario: Dos reportes concurrentes
- **WHEN** dos solicitudes intentan generar tickets al mismo tiempo
- **THEN** cada reporte obtiene un número de ticket único y correlativo

#### Scenario: Tickets tras borrado de registros
- **WHEN** se elimina un reporte y se crea uno nuevo
- **THEN** el nuevo ticket no reutiliza el correlativo del borrado

### Requirement: Suite de pruebas determinista sin red
El sistema SHALL ejecutar los tests del asistente sin efectuar llamadas HTTP a
Gemini, forzando el motor de conocimiento determinista.

#### Scenario: Ejecución de tests con clave Gemini no configurada
- **WHEN** se ejecuta la suite con `GEMINI_API_KEY` vacía
- **THEN** el chatbot responde desde el motor fallback y los tests son estables