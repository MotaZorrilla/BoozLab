# Tareas: rbac-admin

> [] = completado durante la implementación. Todos los ítems marcados.

## 1. Modelo de datos

- [x] 1.1 Crear migración `add_is_admin_to_users_table` (boolean default false) y verificar con `php artisan migrate:status`
- [x] 1.2 Añadir `is_admin` a `$fillable` y al cast booleano en `User` y verificar con un dump de la clase

## 2. Autorización

- [x] 2.1 Crear middleware `EnsureAdmin` que aborta con 403 y verificar que responde en una ruta de prueba
- [x] 2.2 Registrar el alias `admin` en `bootstrap/app.php`
- [x] 2.3 Aplicar `['auth','verified','admin']` al grupo de rutas administrativas en `routes/web.php`

## 3. Seeder

- [x] 3.1 Actualizar `BoozClinicalPlatformSeeder` para que el admin tenga `is_admin=true` y verificar con `php artisan db:seed`

## 4. Tests de la malla de seguridad

- [x] 4.1 Test: admin autenticado ve el dashboard (HTTP 200)
- [x] 4.2 Test: no-admin autenticado recibe 403 en dashboard y rutas admin
- [x] 4.3 Test: invitado redirige a login
- [x] 4.4 Ejecutar `php artisan test` completo y confirmar suite en verde

## 5. Cierre

- [x] 5.1 Pint (`vendor/bin/pint --dirty`) sin errores
- [x] 5.2 Archivar change con `openspec archive rbac-admin` cuando la suite esté verde