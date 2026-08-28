# Propuesta: rbac-admin

## Resumen

El panel administrativo (dashboard, CRUD de productos, gestión de reportes de
farmacovigilancia) estaba protegido únicamente por autenticación (`auth`). Cualquier
usuario registrado podía acceder a rutas administrativas y ejercer acciones de
Dirección Técnica, lo que constituye un riesgo de integridad clínica y normativa.

## Objetivo

Restringir el acceso a las rutas administrativas exclusivamente a usuarios con el
rol `is_admin = true`, añadiendo cobertura de tests para el caso "happy path" (admin)
y los casos adversos (guest y usuario no-admin).

## Alcance

- Migración que añade `is_admin` (boolean, default `false`) a `users`.
- Middleware `EnsureAdmin` que responde `403` a usuarios sin rol admin.
- Registro del alias de middleware `admin` y aplicación al grupo de rutas admin.
- Actualización del seeder para que `admin@boozlaboratorio.com` conserve el rol admin.
- Tests: acceso permitido para admin, denegado (403) para no-admin y redirección a
  login para invitados.

## No-goals

- No se implementa multitenancy ni roles adicionales (médico, farmacéutico).
- No se modifica el modelo de permisos del frontend (los enlaces siguen igual).

## Impacto

- Cambia la invariante "usuario autenticado ⇒ puede administrar".
- Requiere rotar el acceso de cualquier usuario no-admin preexistente.