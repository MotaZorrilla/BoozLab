# Diseño: farmacovigilancia-integridad

## Context

`home.tsx` simulaba el envío ("mensaje recibido") sin llamar al backend. La tabla
`messages` no tenía controlador. `PharmacovigilanceReport::generateTicketNumber()`
usaba `count()+1` (colisión si se borran filas o bajo concurrencia). Los tests del
chatbot dependían de la clave Gemini real del `.env`. Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Persistencia real desde el home (reportes y mensajes) con feedback auténtico.
- Tickets únicos y correlativos bajo concurrencia.
- Tests deterministas sin tráfico externo.

**Non-Goals:**
- Notificaciones por correo/WhatsApp de nuevos reportes.
- Colas de procesamiento para farmacovigilancia.

## Decisions

**1. Éxito solo tras confirmación del servidor.**
El frontend muestra la tarjeta de éxito únicamente cuando la respuesta del backend
es `status: success` y el HTTP es 2xx; errores de validación y de red muestran un
mensaje de error inline. Mantiene el contrato de integridad clínica exigido por las
pruebas de unhappy paths.

**2. Atmósfera de tickets: transacción + retry antes que contador aislado.**
`generateTicketNumber()` obtiene el máximo `ticket_number` del año dentro de una
transacción con `lockForUpdate()` (no-op inofensivo en SQLite, bloqueante en
MySQL/PG) y el controller envuelve generación+create en `DB::transaction` con el
helper global `retry()`. Ante un `UniqueConstraintViolation`, el retry recalcula el
siguiente correlativo. Alternativa descartada: tabla de secuencias dedicada (no
justifica una tabla nueva).

**3. Aislamiento de Gemini por entorno de test, no por fake.**
`phpunit.xml` fija `GEMINI_API_KEY=""`; el controller cae al motor determinista.
Alternativa descartada: `Http::fake()` por test — acoplaba la suite al payload de la
API y a la rama Gemini, haciendo los tests más frágiles.

**4. Endpoint único para mensajes públicos.**
`MessageController@store` con validación explícita de `type` y `status=Pendiente`
por defecto, detrás de `throttle:10,1`, coherente con el excepcionado CSRF
globalmente activo (el frontend ya envía `X-CSRF-TOKEN`).

## Risks / Trade-offs

- [SQLite no bloquea escrituras concurrentes con `lockForUpdate`] → El retry por
  índice único cubre el caso; el lock aporta serialización en motores productivos.

## Migration Plan

1. Desplegar migración de tickets (ninguna nueva; solo lógica).
2. El formulario derechamente conectado: no requiere migración de datos.
3. Rollback: reposición del handler ficticio no aplica; mantener endpoint y revertir
   el fetch.

## Open Questions

Ninguna.