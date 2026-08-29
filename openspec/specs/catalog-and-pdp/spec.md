# Catalog and Dedicated Product Pages (PDP) Specification

## Purpose
Proveer un catálogo digital farmacéutico de 18 medicamentos y productos dermocosméticos organizados en 4 líneas terapéuticas, con páginas dedicadas dinámicas por producto y enlace directo a WhatsApp para consultas y compras.

## Requirements

### Requirement: Clasificación en 4 Líneas Terapéuticas
El sistema SHALL clasificar todos los productos en una de las 4 líneas aprobadas: 01 Cuidado de la piel, 02 Tratamiento tópico, 03 Salud y bienestar, o 04 Cuidado especializado.

#### Scenario: Filtrado reactivo por línea
- **WHEN** el usuario selecciona una línea terapéutica en el carrusel de la página de inicio
- **THEN** el catálogo se filtra instantáneamente mostrando únicamente los productos pertenecientes a esa línea

### Requirement: Ficha Médica Individual Dedicada (PDP)
Cada producto SHALL disponer de una ruta individual accesible bajo `/producto/{slug}` que expone su fórmula cuali-cuantitativa, presentación, indicaciones, posología y contraindicaciones.

#### Scenario: Acceso a ficha por slug
- **WHEN** un visitante o profesional navega a `/producto/{slug}` con un slug válido
- **THEN** el sistema renderiza la ficha médica detallada con fotografía en alta resolución del empaque oficial y productos relacionados de la misma línea

#### Scenario: Acceso a slug inexistente
- **WHEN** un usuario intenta acceder a `/producto/slug-invalido`
- **THEN** el sistema responde con un estado HTTP 404 Not Found

### Requirement: Enlace Contextual Directo a WhatsApp
Cada ficha técnica SHALL incluir un botón de acción rápida que redirige al canal oficial de WhatsApp de Booz Laboratorio (+58 414 8873615) con un mensaje prellenado que incluye el nombre del producto y su presentación.

#### Scenario: Clic en botón de WhatsApp en PDP
- **WHEN** el usuario presiona el botón de consulta vía WhatsApp
- **THEN** se abre la aplicación de WhatsApp con el texto prellenado contextualizado para el producto específico

### Requirement: Nombres Reales de Líneas Terapéuticas en Filtros de Catálogo
El sistema SHALL mostrar los nombres comerciales y oficiales de las líneas (*Cuidado de la piel*, *Tratamiento tópico*, *Salud y bienestar*, *Cuidado especializado*) en lugar de códigos abstractos o números en todos los selectores y botones de filtro tanto en la vista pública como en el panel administrativo.

#### Scenario: Filtrado con nombres reales de líneas en el panel
- **WHEN** el administrador navega a `/admin/products`
- **THEN** los botones de filtro muestran los nombres reales oficiales junto al conteo de fármacos disponibles

### Requirement: Columnas Independientes de Producto y Presentación con Miniaturas
La tabla de inventario del catálogo en `/admin/products` SHALL desagregar en columnas distintas el nombre del producto y la presentación farmacéutica, incluyendo una miniatura fotográfica del fármaco.

#### Scenario: Visualización desagregada en la tabla administrativa
- **WHEN** el administrador consulta la tabla de productos
- **THEN** la información se presenta con columna dedicada para Foto, Producto, Presentación, Línea Terapéutica, Principio Activo, Precio y Stock

### Requirement: Editor Integral de Fichas Médicas & Landing Page
El sistema SHALL proveer una sección dedicada (`activeTab === 'editor'`) en `/admin/products` que permita editar en tiempo real toda la información visible en la landing page del fármaco (`/productos/{slug}`), incluyendo fotografía (con selector visual de miniaturas oficiales en 1-clic o carga de archivo), descripción destacada, indicaciones clínicas, posología y contraindicaciones.

#### Scenario: Edición y previsualización de ficha técnica
- **WHEN** el administrador modifica los textos clínicos o fotografía de un fármaco desde el editor integral
- **THEN** los cambios se persisten en la base de datos y se reflejan inmediatamente en la landing page pública con botón de previsualización directa

