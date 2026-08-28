# Tareas: farmacovigilancia-integridad

> [] = completado durante la implementación. Todos los ítems marcados.

## 1. Endpoint de mensajes públicos

- [x] 1.1 Crear `MessageController@store` con validación de `type/name/email/message` y `status=Pendiente`
- [x] 1.2 Registrar `POST /api/messages` con `throttle:10,1` y verificar con `php artisan route:list`
- [x] 1.3 Crear `MessageSubmissionTest` (éxito, campos requeridos, tipo inválido) y confirmar verde

## 2. Formulario del home real

- [x] 2.1 Convertir inputs del home en estado controlado (name, email, phone, message, product_name)
- [x] 2.2 Conectar pestaña "Reportar Evento" a `POST /api/farmacovigilancia` con token CSRF
- [x] 2.3 Conectar pestañas Consulta/Comercial a `POST /api/messages`
- [x] 2.4 Mostrar éxito solo tras respuesta `success`; errores inline en caso contrario
- [x] 2.5 Verificar `npm run types` + `npm run build` sin errores

## 3. Tickets atómicos

- [x] 3.1 Calcular siguiente ticket desde el último `ticket_number` del año (sin depender de count)
- [x] 3.2 Envolver generación+create en `DB::transaction` con `retry()` ante colisión única
- [x] 3.3 Ejecutar `PharmacovigilanceTest` completo y confirmar formatos y unicidad

## 4. Tests deterministas

- [x] 4.1 Añadir `GEMINI_API_KEY=""` a `phpunit.xml`
- [x] 4.2 Ejecutar `ChatbotGuardrailsTest` y confirmar respuestas del motor fallback

## 5. RBAC y cierre

- [x] 5.1 Ajustar `DashboardTest` al nuevo RBAC (admin 200 / no-admin 403)
- [x] 5.2 Pint, suite completa y build de producción en verde
- [x] 5.3 Archivar change con `openspec archive farmacovigilancia-integridad`