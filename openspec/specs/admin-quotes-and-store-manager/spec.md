# Admin Quotes and Virtual Store Manager Specification

## Purpose
Proveer un administrador integral de la tienda virtual y demanda comercial farmacéutica en `/admin/quotes` que permita auditar pedidos provenientes del carrito web, WhatsApp y visitas en planta, gestionar unidades disponibles de stock, emitir comprobantes oficiales de cotización con membrete legal del laboratorio y clasificar la demanda según el tipo de cliente.

## Requirements

### Requirement: CRUD y Filtros Combinados de Cotizaciones
El sistema SHALL permitir listar, buscar y filtrar cotizaciones combinando estado (*Pendiente*, *Contactado*, *Despachado*, *Cancelado*), tipo de cliente (*Paciente*, *Farmacia*, *Clínica*, *Distribuidor*) y canal de origen (*whatsapp*, *web_cart*, *manual*).

#### Scenario: Filtrado de cotizaciones de farmacias aliadas
- **WHEN** el gestor comercial selecciona el filtro de tipo de cliente "Farmacia"
- **THEN** la tabla muestra únicamente las solicitudes correspondientes a farmacias aliadas con el cálculo de su total en USD

### Requirement: Creación de Cotización Manual
El sistema SHALL permitir registrar cotizaciones manuales para pedidos recibidos por teléfono, visita en planta o convenios institucionales directos, con selección dinámica de fármacos, cantidades y cálculo automático del total estimado.

#### Scenario: Registro de pedido recibido en planta
- **WHEN** el operador completa el formulario de cotización manual con datos del cliente y fármacos requeridos
- **THEN** el sistema asigna el correlativo `BOOZ-COT-YYYY-XXXX`, persiste los ítems en base de datos y actualiza las métricas de demanda

### Requirement: Control y Carga Rápida de Stock
El sistema SHALL proveer una pestaña de control de inventario donde el gestor comercial puede visualizar y actualizar masivamente las unidades disponibles de cada fármaco en planta.

#### Scenario: Actualización de unidades disponibles en planta
- **WHEN** el administrador modifica las existencias de un producto en la tabla de stock rápido
- **THEN** el sistema guarda el nuevo inventario y alerta con badge amarillo si el stock desciende por debajo de 15 unidades

### Requirement: Emisión de Comprobante Oficial de Cotización
Cada cotización SHALL disponer de una vista imprimible formal accesible bajo `/admin/quotes/{id}/print` que incluye el membrete de BOOZ LABORATORIO VGME, C.A. (RIF J-40906185-0), dirección de planta en Valle de Guanape, desglose de ítems, condiciones comerciales y firmas autorizadas.

#### Scenario: Generación de comprobante para despacho
- **WHEN** el operador presiona el botón "Comprobante Oficial"
- **THEN** se despliega el voucher imprimible optimizado para exportación directa a PDF

### Requirement: Resiliencia de Modales de Interfaz
Los modales de detalle y creación de cotizaciones SHALL operar de forma resiliente admitiendo indistintamente las propiedades `isOpen` y `show` en el componente base de HeadlessUI Transition.

#### Scenario: Apertura fluida de modales sin excepciones
- **WHEN** el usuario hace clic en gestionar pedido o registrar nueva cotización
- **THEN** el modal se despliega con animación suave sin arrojar errores de propiedad en la consola del navegador
