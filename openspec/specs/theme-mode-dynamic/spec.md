# Dynamic Theme Mode (Light / Dark) Specification

## Purpose
Garantizar una experiencia de lectura clínica confortable y accesible tanto en ambientes de alta luminosidad como en entornos nocturnos o clínicos con baja iluminación, mediante la alternancia fluida entre Modo Claro y Modo Oscuro dinámico con persistencia local y consistencia universal a través de todas las vistas (portal público, catálogo, fichas PDP y panel administrativo).

## Requirements

### Requirement: Detección Automática de Preferencias del Sistema
Al iniciar la aplicación por primera vez sin preferencia previa guardada, el sistema SHALL adoptar la preferencia cromática del sistema operativo mediante `window.matchMedia('(prefers-color-scheme: dark)')`.

#### Scenario: Usuario con tema oscuro configurado en su SO
- **GIVEN** un visitante sin valor en `localStorage.appearance` ni `localStorage.booz_theme`
- **WHEN** el sistema operativo del usuario tiene configurado el modo oscuro
- **THEN** el sitio aplica automáticamente la clase `dark` al elemento raíz `<html>` y fija `colorScheme = 'dark'` sin parpadeos (FOUC)

### Requirement: Conmutación Manual Accesible Universal
El sistema SHALL proveer un botón interactivo visible tanto en la barra de navegación del portal público (`BoozLayout`) como en la cabecera del panel administrativo (`AppSidebarHeader`) que permite alternar instantáneamente entre Modo Claro y Modo Oscuro.

#### Scenario: Alternar de claro a oscuro en el portal público
- **GIVEN** la interfaz en Modo Claro (icono de luna visible en navbar)
- **WHEN** el usuario presiona el botón de tema
- **THEN** la interfaz transiciona suavemente a la paleta nocturna (`#070C18` / `#0A1124`), el icono cambia al sol y se actualiza `localStorage` con `'dark'`

#### Scenario: Alternar de claro a oscuro en el panel administrativo
- **GIVEN** el administrador en `/dashboard` en Modo Claro
- **WHEN** presiona el botón de tema ubicado en la cabecera (`AppSidebarHeader`)
- **THEN** la consola administrativa aplica inmediatamente la paleta oscura clínica (`#0D172E`) y persiste la elección en el almacén unificado

### Requirement: Persistencia y Sincronización entre Vistas
La preferencia seleccionada por el usuario SHALL persistir en `localStorage` sincronizada en las claves `appearance` y `booz_theme` además de una cookie para SSR, asegurando que la navegación entre el portal público y el panel administrativo conserve de forma idéntica el modo elegido.

#### Scenario: Transición del portal público al panel administrativo
- **GIVEN** que el usuario activó Modo Oscuro en la página de inicio o en una ficha técnica
- **WHEN** el usuario navega a `/dashboard`
- **THEN** el panel administrativo se abre directamente en Modo Oscuro sin reiniciarse a Modo Claro
