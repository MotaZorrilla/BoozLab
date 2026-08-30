# Mobile Bottom Navigation Bar Specification

## Purpose
Proveer a los usuarios de dispositivos móviles una barra de navegación fija inferior tipo aplicación nativa (PWA / Mobile-First), facilitando la navegación con una sola mano y el acceso inmediato a catálogo, tienda, asistente IA Lira, panel administrativo y canal WhatsApp.

## Requirements

### Requirement: Visibilidad Exclusiva en Dispositivos Móviles
La barra de navegación inferior SHALL renderizarse fija en la parte inferior (`fixed bottom-0 left-0 right-0 z-40`) únicamente en pantallas con ancho menor a 768px (`md:hidden`).

#### Scenario: Visualización en viewport móvil
- **WHEN** la resolución del dispositivo es inferior a 768px
- **THEN** la barra de navegación inferior se muestra fija sobre el contenido y el contenedor principal aplica un margen inferior de seguridad (`pb-safe`) para evitar solapamientos

#### Scenario: Visualización en viewport de escritorio
- **WHEN** la resolución del dispositivo es igual o superior a 768px
- **THEN** la barra de navegación inferior permanece oculta (`hidden`)

### Requirement: 5 Puntos de Contacto Ergonómicos en Barra Inferior
La barra de navegación móvil SHALL ofrecer exactamente 5 acciones directas:
1. **Líneas:** Enlace ancla reactivo a `/#lineas`
2. **Vigilancia:** Enlace directo oficial al canal de `/farmacovigilancia` con icono `ShieldAlert`
3. **Lira IA:** Botón central flotante y elevado con el avatar circular de Lira
4. **Tienda:** Disparador del drawer de bolsa de pedidos con indicador numérico de unidades
5. **Consola:** Enlace directo a `/dashboard`

#### Scenario: Badge Reactivo en Botón de Tienda Móvil
- **GIVEN** que el usuario añade unidades de productos a su bolsa
- **WHEN** se observa el botón de "Tienda" en la barra inferior
- **THEN** se exhibe un badge numérico verde con la suma de unidades sobre el icono

#### Scenario: Apertura de Lira desde el botón central móvil
- **WHEN** el usuario pulsa el avatar central de Lira en la barra inferior móvil
- **THEN** se despliega la modal interactiva del Asistente Virtual Lira IA

### Requirement: Menú Móvil Desplegable en Cabecera
La cabecera del portal público (`BoozLayout`) SHALL proveer un botón de menú hamburguesa (`Menu` / `X`) en pantallas móviles y tablets menores a 1024px (`< lg`), desplegando un panel superior con enlaces completos a Líneas, Catálogo, Conocimiento Clínico, Farmacovigilancia (con badge oficial INH) y Consola.

#### Scenario: Apertura y cierre de menú hamburguesa móvil
- **WHEN** el usuario pulsa el botón hamburguesa en la barra superior móvil
- **THEN** se abre el panel animado con todos los accesos directos y permite navegar cerrándose automáticamente al pulsar cualquier opción

### Requirement: Botón Flotante de WhatsApp Multidispositivo
El botón de contacto directo a WhatsApp SHALL posicionarse por encima de la barra inferior móvil (`bottom-20 right-3.5` en smartphones y `bottom-6 right-6` en escritorio) evitando solapamientos y facilitando la interacción con un solo pulgar.

#### Scenario: Visualización ergonómica de WhatsApp flotante
- **WHEN** el usuario navega desde un teléfono móvil
- **THEN** el botón de WhatsApp flota sobre la barra fija inferior sin obstaculizar los botones de navegación

