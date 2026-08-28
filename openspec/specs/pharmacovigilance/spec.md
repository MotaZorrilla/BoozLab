# Pharmacovigilance and Quality Reporting Specification

## Purpose
Establecer el canal sanitario oficial para la notificación de sospechas de reacciones adversas a medicamentos (RAM), fallas de empaque y reportes de calidad exigidos por el Instituto Nacional de Higiene "Rafael Rangel" (INH).

## Requirements

### Requirement: Registro de Notificaciones de Farmacovigilancia
El sistema SHALL permitir a pacientes, médicos, farmacéuticos y droguerías registrar reportes indicando producto, número de lote grabado, fecha de caducidad, severidad y descripción del evento.

#### Scenario: Envío exitoso de reporte con datos completos
- **WHEN** un notificante completa el formulario oficial en `/farmacovigilancia` con los campos obligatorios
- **THEN** el sistema persiste el reporte en la base de datos con estado "Pendiente" y genera un número de ticket único

#### Scenario: Validación de campos obligatorios
- **WHEN** se envía un reporte sin producto, nombre de notificante o descripción del evento
- **THEN** el sistema rechaza la solicitud con un código HTTP 422 Unprocessable Entity indicando los errores de validación

### Requirement: Correlativo de Ticket Oficial
Cada reporte aprobado SHALL generar un código correlativo inmutable con formato `BOOZ-FV-YYYY-XXXX`.

#### Scenario: Generación secuencial de ticket
- **WHEN** se crea un nuevo reporte en el año en curso
- **THEN** el número correlativo se incrementa de forma secuencial y única evitando duplicidades

### Requirement: Gestión y Auditoría Administrativa
El panel administrativo `/dashboard` SHALL proporcionar una bandeja para que la dirección técnica y la farmacéutica patrocinante revisen los reportes, actualicen su estado a "En Revisión" o "Resuelto", y registren notas de dictamen técnico.

#### Scenario: Cambio de estado de reporte
- **WHEN** un administrador autorizado actualiza el estado y añade notas
- **THEN** el reporte actualiza sus campos en base de datos conservando la trazabilidad
