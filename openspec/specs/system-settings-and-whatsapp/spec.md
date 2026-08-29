# System Settings and Dynamic WhatsApp Specification

## Purpose
Proveer un mecanismo centralizado de configuración dinámica para el número telefónico oficial de WhatsApp de atención y ventas, los datos legales de la compañía (RIF y razón social) y la ubicación de la planta de producción de Booz Laboratorio, asegurando que todos los botones y puntos de contacto se actualicen en tiempo real sin requerir despliegues de código.

## Requirements

### Requirement: Centralización de Parámetros de Contacto y WhatsApp
El sistema SHALL almacenar el número telefónico oficial de WhatsApp y el mensaje de apertura en la tabla `system_settings` con invalidación automática de memoria caché.

#### Scenario: Modificación del número de WhatsApp por el Super Administrador
- **WHEN** un usuario con rol `super_admin` envía nuevos valores desde `/admin/settings`
- **THEN** el sistema persiste los cambios en la base de datos, purga la clave de caché global y notifica el éxito de la operación

### Requirement: Inyección Global y Propagación Reactiva a Vistas Públicas
El sistema SHALL inyectar las configuraciones públicas de WhatsApp y datos legales a través del middleware de Inertia hacia todos los componentes clientes (botón flotante, PDP, carrito de compras y pie de página).

#### Scenario: Visualización y redirección con número actualizado
- **WHEN** un visitante navega por la plataforma y hace clic en cualquier botón de WhatsApp
- **THEN** la URL generada apunta al número configurado con sanitización de caracteres numéricos

### Requirement: Sanitización de Formato Telefónico E.164
El sistema SHALL sanear automáticamente los números telefónicos ingresados por el usuario, removiendo símbolos, guiones o espacios para garantizar compatibilidad con el esquema `https://wa.me/{phone}`.

#### Scenario: Ingreso de número con formato local o caracteres especiales
- **WHEN** el administrador ingresa un valor con formato `+58 (414) 887-3615`
- **THEN** el sistema procesa y almacena únicamente la secuencia numérica `584148873615`

### Requirement: Personalización Dinámica de Plantilla de Pedidos de WhatsApp
El sistema SHALL permitir configurar desde `/admin/settings` el encabezado, pie de mensaje y los perfiles de solicitantes permitidos (*Paciente*, *Farmacia*, *Clínica*, *Distribuidor*) para la bolsa de pedidos de la tienda, con simulador interactivo en tiempo real.

#### Scenario: Actualización del encabezado de la bolsa de pedidos
- **WHEN** el Super Administrador modifica la plantilla de pedido en Ajustes
- **THEN** la bolsa de pedidos pública (`store-cart-drawer.tsx`) genera los nuevos pedidos utilizando la cabecera y perfiles personalizados

