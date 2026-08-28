## Purpose

Define el control de acceso al panel administrativo de Booz Laboratorio, de modo
que únicamente usuarios con rol admin puedan gestionar catálogo y reportes.

## ADDED Requirements

### Requirement: Usuario con rol admin accede al panel administrativo
El sistema SHALL permitir el acceso a las rutas administrativas únicamente a
usuarios autenticados cuyo atributo `is_admin` sea `true`.

#### Scenario: Admin autenticado navega al dashboard
- **WHEN** un usuario autenticado con `is_admin = true` solicita una ruta administrativa
- **THEN** el sistema responde con el panel administrativo (HTTP 200)

### Requirement: Usuario sin rol admin no accede al panel administrativo
El sistema SHALL rechazar con HTTP 403 cualquier solicitud a rutas administrativas
proveniente de usuarios autenticados sin el rol admin.

#### Scenario: Usuario registrado común intenta acceder al dashboard
- **WHEN** un usuario autenticado con `is_admin = false` solicita una ruta administrativa
- **THEN** el sistema responde con HTTP 403 y no ejecuta acciones administrativas

### Requirement: Invitados redirigidos al login
El sistema SHALL redirigir al login a los usuarios no autenticados que soliciten
rutas administrativas.

#### Scenario: Sesión no iniciada
- **WHEN** un visitante sin sesión solicita una ruta administrativa
- **THEN** el sistema redirige a la página de inicio de sesión

### Requirement: El rol admin se preserva en el seeder
El sistema SHALL crear/actualizar al usuario `admin@boozlaboratorio.com` con
`is_admin = true` durante el seed, garantizando un superusuario inicial verificable.

#### Scenario: Seed del entorno
- **WHEN** se ejecuta el seeder determinista de la plataforma
- **THEN** el usuario `admin@boozlaboratorio.com` queda registrado con rol admin

### Requirement: No-admin no ejerce acciones de escritura
El sistema SHALL impedir que usuarios sin rol admin creen, editen, activen,
eliminen productos o actualicen el estado de reportes de farmacovigilancia.

#### Scenario: Intento de creación de producto por no-admin
- **WHEN** un usuario autenticado sin rol admin envía un POST de creación de producto
- **THEN** el sistema responde con HTTP 403 y no persiste el producto