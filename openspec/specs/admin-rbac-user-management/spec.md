# Admin RBAC and User Management Specification

## Purpose
Establecer un sistema integral de control de acceso basado en roles (RBAC) para el personal de Booz Laboratorio, permitiendo delegar funciones a Directores Técnicos, Gestores Comerciales y Oficiales de Farmacovigilancia bajo la supervisión del Super Administrador, con salvaguardas contra auto-eliminación y orfandad administrativa.

## Requirements

### Requirement: Esquema de 4 Roles Oficiales del Laboratorio
El sistema SHALL soportar cuatro roles predefinidos: `super_admin`, `director_tecnico`, `gestor_comercial` y `oficial_farmacovigilancia`, cada uno con su matriz de permisos asignada.

#### Scenario: Alta de nuevo operador administrativo
- **WHEN** un Super Administrador registra un usuario con rol `gestor_comercial` desde `/admin/users`
- **THEN** el sistema persiste el usuario con contraseña encriptada, asocia el rol en la tabla pivote y le concede acceso al panel administrativo

### Requirement: Salvaguardas de Integridad y Seguridad de Cuentas
El sistema SHALL impedir que un usuario autenticado elimine su propia cuenta y que se elimine o degrade al único Super Administrador registrado en la plataforma.

#### Scenario: Intento de auto-eliminación de cuenta activa
- **WHEN** el usuario autenticado intenta ejecutar una solicitud DELETE contra su propio identificador de usuario
- **THEN** el sistema cancela la acción devolviendo un mensaje de error y manteniendo la cuenta intacta

#### Scenario: Protección contra la eliminación del único Super Administrador
- **WHEN** se intenta eliminar al único usuario que posee el rol `super_admin`
- **THEN** el sistema rechaza la solicitud protegiendo la plataforma contra la orfandad administrativa

### Requirement: Autorización Granular y Control de Acceso (Gates/Middleware)
El sistema SHALL restringir el acceso a módulos críticos (`/admin/users`, `/admin/ai`, `/admin/settings`) exclusivamente a usuarios con rol `super_admin`.

#### Scenario: Intento de acceso a configuración por rol no autorizado
- **WHEN** un usuario con rol `oficial_farmacovigilancia` intenta acceder a `/admin/settings` o `/admin/ai`
- **THEN** el sistema interrumpe la navegación retornando una respuesta HTTP 403 Acceso Denegado
