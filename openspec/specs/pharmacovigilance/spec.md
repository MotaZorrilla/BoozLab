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

### Requirement: Soporte Completo de Modo Oscuro en Farmacovigilancia
La vista oficial `/farmacovigilancia` SHALL soportar al 100% el tema oscuro del sistema mediante clases `dark:` de Tailwind, adaptando el fondo general (`dark:bg-[#070C18]`), tarjeta de formulario (`dark:bg-[#0D172E]`), aviso sanitario del INH, selectores, campos de texto y modal de confirmación de ticket.

#### Scenario: Visualización del canal de farmacovigilancia en modo oscuro
- **GIVEN** que el usuario tiene activado el Modo Oscuro
- **WHEN** navega al formulario de reporte en `/farmacovigilancia`
- **THEN** todos los componentes se adaptan armónicamente sin fondos blancos discordantes garantizando contraste clínico WCAG

### Requirement: Impresión de Acta Oficial Sanitaria INH
El sistema SHALL permitir imprimir o exportar a PDF el acta oficial sanitaria de cualquier reporte registrado bajo la ruta `/admin/reports/{report}/print` con membrete corporativo, firmas de regencia técnica y protocolo INH.

#### Scenario: Impresión de acta oficial sanitaria
- **WHEN** un usuario con permisos autorizados presiona "Imprimir Acta" en el panel de reportes
- **THEN** se renderiza la vista `reports.acta-sanitaria` en formato azul corporativo lista para ser enviada a la impresora o guardada en PDF

