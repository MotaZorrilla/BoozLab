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

### Requirement: 5 Puntos de Contacto Ergonómicos
La barra de navegación móvil SHALL ofrecer exactamente 5 acciones directas:
1. **Líneas:** Enlace ancla reactivo a `/#lineas`
2. **Tienda:** Disparador del drawer de bolsa de pedidos con indicador visual de unidades
3. **Lira IA:** Botón central flotante y elevado con el avatar circular de Lira
4. **Admin:** Enlace directo a `/dashboard`
5. **WhatsApp:** Enlace directo a conversación oficial de WhatsApp

#### Scenario: Badge Reactivo en Botón de Tienda Móvil
- **GIVEN** que el usuario añade unidades de productos a su bolsa
- **WHEN** se observa el botón de "Tienda" en la barra inferior
- **THEN** se exhibe un badge numérico verde con la suma de unidades sobre el icono

#### Scenario: Apertura de Lira desde el botón central móvil
- **WHEN** el usuario pulsa el avatar central de Lira en la barra inferior móvil
- **THEN** se despliega la modal interactiva del Asistente Virtual Lira IA
