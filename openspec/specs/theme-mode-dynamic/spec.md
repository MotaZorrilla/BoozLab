# Dynamic Theme Mode (Light / Dark) Specification

## Purpose
Garantizar una experiencia de lectura clínica confortable y accesible tanto en ambientes de alta luminosidad como en entornos nocturnos o clínicos con baja iluminación, mediante la alternancia fluida entre Modo Claro y Modo Oscuro dinámico con persistencia local.

## Requirements

### Requirement: Detección Automática de Preferencias del Sistema
Al iniciar la aplicación por primera vez sin preferencia previa guardada, el sistema SHALL adoptar la preferencia cromática del sistema operativo mediante `window.matchMedia('(prefers-color-scheme: dark)')`.

#### Scenario: Usuario con tema oscuro configurado en su SO
- **GIVEN** un visitante sin valor en `localStorage.booz_theme`
- **WHEN** el sistema operativo del usuario tiene configurado el modo oscuro
- **THEN** el sitio aplica automáticamente la clase `dark` al elemento raíz `<html>` y fija `colorScheme = 'dark'`

### Requirement: Conmutación Manual Accesible
El sistema SHALL proveer un botón interactivo visible en la barra de navegación que permite alternar instantáneamente entre Modo Claro y Modo Oscuro.

#### Scenario: Alternar de claro a oscuro
- **GIVEN** la interfaz en Modo Claro (icono de luna visible)
- **WHEN** el usuario presiona el botón de tema
- **THEN** la interfaz transiciona suavemente a la paleta nocturna (`#070C18` / `#0A1124`), el icono cambia al sol y se actualiza `localStorage` con `'dark'`

### Requirement: Persistencia Inmutable de la Elección del Usuario
La preferencia seleccionada por el usuario SHALL persistir en `localStorage` bajo la clave `booz_theme` y prevalecer sobre la configuración del sistema operativo en visitas subsecuentes.

#### Scenario: Persistencia entre recargas
- **GIVEN** que el usuario seleccionó explícitamente Modo Oscuro
- **WHEN** el usuario navega a otra ruta o recarga el navegador
- **THEN** la aplicación se renderiza inmediatamente en Modo Oscuro sin parpadeos de luz (Flash of Unstyled Content)
