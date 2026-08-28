# Propuesta: farmacovigilancia-integridad

## Resumen

La sección "Reportar Evento" del home mostraba un mensaje de éxito **falso**
(no persistía nada). La suite de tests del chatbot realizaba llamadas HTTP reales
a Gemini (indeterminista si hay clave configurada), y la generación de tickets
`BOOZ-FV-YYYY-NNNN` usaba conteo +1 sin atómica (colisión posible bajo concurrencia).
Además, la tabla `messages` (consultas/contacto) no tenía endpoint para llenarse
desde el sitio público.

## Objetivo

Garantizar integridad farmacéutica: todo reporte del home persiste con ticket
atómico; consultas/comerciales persisten vía `messages`; y la suite de pruebas es
determinista (sin red).

## Alcance

- Endpoint `POST /api/messages` (`MessageController@store`) para consulta/contacto.
- Formulario del home conectado a farmacovigilancia (`/api/farmacovigilancia`) y a
  messages según pestaña.
- Tickets atómicos: siguiente correlativo desde el último ticket del año + retry
  ante colisión única dentro de transacción.
- Aislamiento de Gemini en tests mediante `GEMINI_API_KEY=""` en `phpunit.xml`.
- Tests: envío de mensajes (éxito/validación), RBAC de dashboard y formatos de ticket.

## No-goals

- No se cambia el motor del chatbot (sigue fallback determinista + Gemini opcional).
- No se agrega cola/jobs para envío de correos de notificación.

## Impacto

- El formulario del home pasa de simulación a persistencia real.
- La generación de tickets es segura bajo concurrencia.