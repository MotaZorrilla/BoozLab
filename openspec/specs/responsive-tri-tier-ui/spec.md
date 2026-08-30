# Responsive Tri-Tier UI Architecture Specification

## Purpose
Garantizar una experiencia de usuario ergonómica, estética y sin desbordamientos en tres niveles de resolución: Dispositivos Móviles (smartphones), Escritorio Estándar (1080p Full HD) y Pantallas de Alta Resolución (4K / Ultra-Wide), adaptando las rejillas, los contenedores fluidos y las interfaces administrativas.

## Requirements

### Requirement: Breakpoints Fluidos para Pantallas 4K y Ultra-Wide
El sistema SHALL definir y aplicar breakpoints formales en CSS/Tailwind para pantallas extra-grandes (`--breakpoint-2xl: 96rem;` / 1536px y `--breakpoint-3xl: 120rem;` / 1920px), expandiendo los contenedores principales desde `max-w-7xl` hasta `2xl:max-w-[1536px]` y `3xl:max-w-[1840px]`.

#### Scenario: Visualización en monitor 4K
- **WHEN** la aplicación se visualiza en una pantalla con resolución 4K o superior
- **THEN** los tableros del dashboard y el catálogo aprovechan el ancho real sin concentrar la información en franjas angostas y distribuyen los KPIs y fichas en hasta 4 columnas balanceadas

### Requirement: Vista Táctil de Gestión Móvil en Consola Administrativa
En pantallas menores a 768px (`md:hidden`), las tablas administrativas con múltiples columnas SHALL alternar automáticamente hacia una vista de Tarjetas de Gestión Táctil móvil, permitiendo buscar fármacos, alternar estados y acceder a la edición sin desbordamientos horizontales.

#### Scenario: Gestión de catálogo desde smartphone
- **WHEN** un administrador accede a `/admin/products` desde un teléfono móvil
- **THEN** la tabla de 10 columnas se oculta y se presenta una lista de tarjetas táctiles con fotografía, badges de stock y botones táctiles cómodos

### Requirement: Cuadrícula Móvil Compacta de Tienda Virtual
En la página de inicio, el catálogo SHALL proveer una experiencia de tienda móvil con cuadrícula de 2 columnas compactas en teléfonos, con imágenes cuadradas, badges y botón de compra directa.

#### Scenario: Exploración de productos en smartphone
- **WHEN** el usuario navega el catálogo en un teléfono móvil
- **THEN** los productos se despliegan en una cuadrícula compacta de 2 columnas optimizada para scroll táctil vertical
