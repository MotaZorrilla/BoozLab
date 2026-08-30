# WhatsApp Order Bag & Commercial Quote Drawer Specification

## Purpose
Proveer una experiencia de compra y cotización ágil mediante una bolsa de pedidos lateral persistente que permite a profesionales, farmacias y pacientes consolidar productos del catálogo de Booz Laboratorio y transferir el pedido directamente al canal oficial de WhatsApp (+58 414 8873615) con desglose estructurado y alertas de récipe médico.

## Requirements

### Requirement: Agregación Reactiva de Productos a la Bolsa
El sistema SHALL permitir agregar cualquier producto activo a la bolsa de pedidos tanto desde la vista principal de catálogo como desde la ficha médica detallada (PDP) mediante el evento global `booz:add-to-cart`.

#### Scenario: Agregar un producto por primera vez
- **WHEN** el usuario presiona el botón "+ Pedido" en una tarjeta de producto
- **THEN** el sistema añade el producto a la bolsa con cantidad inicial igual a 1 y despliega automáticamente el drawer lateral

#### Scenario: Incrementar cantidad de un producto ya existente
- **GIVEN** un producto que ya figura en la bolsa con cantidad N
- **WHEN** el usuario vuelve a presionar "+ Pedido" o presiona el botón "+" dentro del drawer
- **THEN** la cantidad del producto se incrementa a N + 1 sin duplicar la tarjeta del producto

### Requirement: Gestión y Modificación de la Bolsa en Drawer
El usuario SHALL poder modificar cantidades, decrementar, eliminar artículos individualmente o vaciar la bolsa completa.

#### Scenario: Reducir cantidad hasta eliminación
- **GIVEN** un artículo en la bolsa con cantidad 1
- **WHEN** el usuario presiona el botón "-" de decremento
- **THEN** el artículo es removido automáticamente de la bolsa de pedidos

#### Scenario: Vaciado completo de la bolsa
- **WHEN** el usuario activa la acción de vaciar la bolsa
- **THEN** la lista queda en cero unidades y se muestra el estado vacío invitando a explorar el catálogo

### Requirement: Persistencia Local de la Bolsa (Client-Side Storage)
El sistema SHALL sincronizar automáticamente el contenido de la bolsa de pedidos en el `localStorage` del navegador bajo la clave `booz_cart`.

#### Scenario: Recarga de página o nueva sesión
- **GIVEN** una bolsa con productos agregados en una sesión previa
- **WHEN** el usuario recarga la página o navega a otra sección del portal
- **THEN** los artículos y sus cantidades se restauran fielmente desde `localStorage`

### Requirement: Alerta Sanitaria de Récipe Médico en el Pedido
Si uno o más productos seleccionados requieren prescripción facultativa (`is_prescription_required: true`), el sistema SHALL destacar dicha condición en la interfaz del drawer y añadir la cláusula `[Nota: Bajo Récipe Médico]` en el texto exportado a WhatsApp.

#### Scenario: Generación de mensaje para producto controlado
- **GIVEN** que el usuario tiene en su bolsa productos que requieren récipe (ej. Bactrocis o Amikacis)
- **WHEN** se genera el enlace de cotización para WhatsApp
- **THEN** el mensaje prellenado incluye la advertencia explícita de requerimiento de prescripción facultativa médica

### Requirement: Generación del Enlace Estructurado a WhatsApp
El botón de confirmación SHALL registrar la cotización en el servidor y redirigir a `https://wa.me/584148873615` con el texto URL-encoded conteniendo: encabezado institucional, lista numerada de productos, presentación, principios activos, cantidad en unidades y solicitud de confirmación de stock.

#### Scenario: Clic en solicitar cotización
- **WHEN** el usuario presiona "Solicitar Cotización vía WhatsApp"
- **THEN** se abre la aplicación de WhatsApp con el mensaje estructurado y exacto de los productos agregados

### Requirement: Navegación Interactiva desde Bolsa Vacía al Catálogo
Cuando la bolsa de pedidos se encuentre vacía, el contenedor y mensaje informativo ("Tu bolsa está vacía...") SHALL ser completamente interactivos y permitir al usuario cerrar el drawer y navegar directamente a la sección de productos del catálogo.

#### Scenario: Clic en estado de bolsa vacía
- **GIVEN** que el usuario abre el drawer sin tener productos añadidos
- **WHEN** presiona la tarjeta del estado vacío o el botón "Ver Catálogo de Productos"
- **THEN** el drawer se cierra de inmediato y el scroll traslada suavemente la pantalla hasta la sección `#productos`

### Requirement: Experiencia de Tienda Móvil a Pantalla Completa
En dispositivos con resolución móvil (`< 640px`), el drawer de la tienda SHALL ocupar el 100% del ancho del viewport (`w-full`) sin márgenes residuales y adaptar su barra inferior de checkout con padding seguro (`pb-safe`) para pantallas con gestos táctiles.

#### Scenario: Apertura de la bolsa en smartphone
- **WHEN** el usuario abre el drawer de la bolsa en un teléfono móvil
- **THEN** el panel cubre el ancho completo de la pantalla y la barra de checkout se sitúa en la parte inferior accesible para el pulgar

