# Diseño: rbac-admin

## Context

El panel administrativo (dashboard, CRUD productos, estado de reportes) está
protegido por el grupo de rutas `['auth', 'verified']` en `routes/web.php`. No
existía distinción de roles: todo usuario autenticado podía administrar. La
plataforma usa autenticación Fortify + sesión, vistas Inertia y seeds
deterministas. Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Introducir un booleano `is_admin` en `users` con default `false`.
- Middleware reutilizable `admin` aplicable al grupo administrativo.
- Comportamiento verificable por tests para guest / admin / no-admin.

**Non-Goals:**
- Motor de permisos granular ni tabla de roles/pivots.
- Cambios de UI para ocultar enlaces; solo autorización de servidor.

## Decisions

**1. Booleano `is_admin` vs tabla de roles.**
Elegimos columna booleana: un solo rol administrativo hoy, superficie mínima,
default seguro. Alternativa descartada: tablas `roles`/`role_user` añaden
complejidad sin requerimiento actual.

**2. Middleware que lanza HTTP 403 directamente.**
`EnsureAdmin` responde `abort(403)` (no redirección) para que los tests puedan
`assertForbidden()` y para reflejar la intención de autorización. El middleware
`auth` previo garantiza que la petición ya tiene usuario.

**3. Sin excepción CSRF en `api/*`.**
`api/*` discrimina por rutas concretas (no wildcard). Cada ruta pública usa
`VerifyCsrfToken` normal; los POST del frontend envían `X-CSRF-TOKEN`. Esto reduce
superficie de ataque y es compatible con throttling por ruta.

**4. Alias del middleware como cadena (`admin`).**
Se registra en `bootstrap/app.php::withMiddleware()`. Aplicado como
`Route::middleware(['auth','verified','admin'])` para mantener la pila explícita.

## Risks / Trade-offs

- [Regresión: usuarios no-admin preexistentes pierden acceso] → Consulta previa y
  migración; el seeder fija el admin inicial.
- [Password del admin hardcodeado en seeder] → En otra iteración moverse a `env`
  (documentado en PLAN).
- [Locking de tickets sensación de complejidad] → Ver change
  `farmacovigilancia-integridad`; aquí no aplica.

## Migration Plan

1. Añadir migración `is_admin` (default false) y ejecutar `php artisan migrate`.
2. Garantizar que el seeder marque el admin antes de migraciones a producción.
3. Rollback: retirar el middleware del grupo de rutas y revertir la columna.

## Open Questions

Ninguna en el estado actual.