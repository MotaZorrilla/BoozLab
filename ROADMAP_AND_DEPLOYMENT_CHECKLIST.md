# 🚀 Hoja de Ruta, Pendientes Operativos y Checklist de Despliegue a Producción
## Booz Laboratorio - Clinical AI Platform

> **Fecha de Actualización:** 30 de Agosto de 2026  
> **Estado Técnico:** 100% Funcional y Verificado (139 Tests PHPUnit en Verde [556 assertions] • 13/13 Especificaciones OpenSpec Validadas)

---

## 📊 1. Resumen del Estado del Sistema

La arquitectura técnica, la base de datos, el vademécum de 18 productos, los módulos administrativos modulares, la tienda virtual con cotizaciones por WhatsApp y el Centro de Entrenamiento RAG de Inteligencia Artificial se encuentran **completamente implementados y probados sin errores**.

### Módulos Listos y Operativos:
1. **Catálogo Farmacéutico & Editor de Fichas Médicas (`/admin/products`):**
   - 4 líneas terapéuticas oficiales (*Cuidado de la piel*, *Tratamiento tópico*, *Salud y bienestar*, *Cuidado especializado*).
   - Columnas separadas de **Producto** y **Presentación** con miniaturas fotográficas y switches de disponibilidad.
   - Editor Integral en vivo para fotografías (galería de miniaturas en 1-clic o subida de archivo), indicaciones clínicas, posología y contraindicaciones con previsualización directa en `/productos/{slug}`.
2. **Administrador de Tienda Virtual & Demanda Comercial (`/admin/quotes`):**
   - CRUD de cotizaciones con filtros combinados (estado, canal, tipo de cliente: *Paciente*, *Farmacia*, *Clínica*, *Distribuidor*).
   - Módulo de **Nueva Cotización Manual** para pedidos tomados por teléfono o en planta en Valle de Guanape.
   - Pestaña de **Control Rápido de Stock** y unidades disponibles.
   - Emisión de **Comprobante Oficial Imprimible** y exportable a PDF con RIF y membrete del laboratorio (`BOOZ-COT-YYYY-XXXX`).
   - Resiliencia de modales HeadlessUI con soporte unificado de `isOpen` y `show`.
3. **Ajustes Dinámicos & Plantillas de WhatsApp (`/admin/settings`):**
   - Centralización del número oficial de ventas (`+58 414 8873615`), razón social y RIF `J-40906185-0`.
   - Personalización completa de la plantilla de WhatsApp para la bolsa de pedidos (encabezado, pie de mensaje y perfiles de solicitante) con simulador interactivo en tiempo real.
4. **Centro de Entrenamiento Documental RAG & Guardrails de Lira AI (`/admin/ai`):**
   - Base de conocimiento documental con 4 documentos maestros precargados (Vademécum de 18 fármacos de `A.docx` e INH, Protocolo de Farmacovigilancia INH, Manual de Cotizaciones y Guía de Trato y Empatía).
   - Capacidad de subir archivos `.txt`, `.md`, `.json`, `.csv` o redactar textos clínicos con switches para activar/pausar del entrenamiento.
   - Gestor de Guardrails Sanitarios (*Bloqueo Estricto*, *Advertencia Sanitaria*, *Derivación a Soporte Humano*) con protección de reglas estructurales de sistema.
   - Inyección dinámica en Google Gemini y en el motor determinista local.
   - Simulador playground en vivo para probar consultas con métricas de latencia en milisegundos.
5. **Consola Ejecutiva (`/dashboard`):**
   - KPIs superiores en tiempo real y 4 fichas destacadas de enlace directo a las operaciones farmacéuticas.
6. **Bandeja de Farmacovigilancia INH (`/admin/reports`) & Mensajes (`/admin/messages`):**
   - Actas sanitarias imprimibles/PDF, exportación masiva a CSV para Excel y respuesta directa por WhatsApp en 1-clic.
7. **Control de Acceso RBAC & Usuarios (`/admin/users`):**
   - 4 roles oficiales configurados (`super_admin`, `director_tecnico`, `gestor_comercial`, `oficial_farmacovigilancia`) y matriz de permisos.
8. **Experiencia de Catálogo en Landing Page (Fase 21):**
   - Carrusel infinito con efecto peek lateral responsivo (~5.5% desktop, ~3.5% tablet, ~9% móvil) y soporte gestual nativo (swipe táctil).
   - Tarjeta 100% clickeable hacia la Ficha Técnica Médica (`/producto/{slug}`) y botón "+ Pedido" ergonómico con eventos aislados.
   - Transiciones suaves de 220ms entre líneas terapéuticas y necesidades clínicas.
9. **Navegación Esencial, Consola y Login Corporativo (Fases 22 y 23):**
   - Menú superior depurado a 4 accesos esenciales (*Líneas*, *Catálogo*, *Conocimiento*, *Farmacovigilancia*), buscador lupa con atajo `Ctrl+K` y calculadora pediátrica reubicada en footer.
   - Pantalla `/login` unificada con `BoozLayout`, supresión de autoregistro público y botón exclusivo en Dashboard para que el Superadmin registre colaboradores con asignación de roles.
10. **Segmentación Multicanal de Telefonía & Redes Oficiales (Fase 24):**
    - 3 líneas independientes en `system_settings` y `/admin/settings` (WhatsApp Atención General, WhatsApp Ventas/Tienda y Central Telefónica de Planta).
    - Hook reactivo `useWhatsApp` y unificación de redes corporativas en el pie de página (`@booz.laboratorio`).
11. **Calculadora Pediátrica Clínica Desacoplada & Motor RAG `LiraAiService` (Fase 25):**
    - Motor reactivo de 3 métodos matemáticos oficiales (Regla de Clark, Régimen Ponderado fraccionado y Regla de Young).
    - Servicio `LiraAiService` desacoplado y deshardcodeo total de datos de planta, RIF y telefonía en respuestas deterministas y RAG.
12. **Arquitectura Responsiva Tri-Nivel: Móvil, 1080p y 4K (Fase 26):**
    - Breakpoints `--breakpoint-2xl: 96rem` y `--breakpoint-3xl: 120rem` con expansión de contenedores fluidos hasta 1840px para eliminar bandas vacías en monitores 4K.
    - Tarjetas táctiles de gestión en `/admin/products` para control completo desde smartphones sin desbordamientos de tabla.
    - Cuadrícula compacta de tienda móvil en 2 columnas y bolsa a pantalla completa (`w-full`).
13. **Farmacovigilancia Dark Mode, Vademécum Clínico en PDF & Compra Directa (Fase 27):**
    - Soporte completo de tema oscuro en `/farmacovigilancia` y menú móvil desplegable en cabecera.
    - Tarjeta comercial destacada y botón táctil "+ Añadir a la Bolsa" directamente en `/producto/{slug}`.
    - Ficha Técnica & Vademécum Clínico Oficial en PDF imprimible (`/producto/{slug}/vademecum`) con diseño azul `#002072`, fotografía del fármaco y protocolo INH.

---

## 🟡 2. Checklist de Salida a Producción (Tareas Operativas Pendientes)

Estas tareas dependen de datos reales de la empresa y configuraciones del entorno de producción:

### [ ] 1. Inserción de la API Key Real de Google Gemini
- **Ubicación:** Consola de IA en [`http://localhost:8000/admin/ai`](http://localhost:8000/admin/ai) (pestaña *Motor Gemini & Directriz Base*).
- **Acción:** Pegar la clave de Google AI Studio definitiva y presionar "Guardar Ajustes".
- **Nota:** El sistema guarda la clave cifrada con AES-256 en la tabla `system_settings`. Mientras no se configure una clave real, Lira opera automáticamente con el motor clínico local determinista sin errores.

### [ ] 2. Configuración del Servidor de Correo SMTP para Alertas Reales
- **Ubicación:** Archivo `.env` del servidor.
- **Acción:** Reemplazar el controlador de correo por las credenciales del correo institucional de Booz Laboratorio:
  ```env
  MAIL_MAILER=smtp
  MAIL_HOST=smtp.gmail.com # o el host de cPanel/Workspace
  MAIL_PORT=587
  MAIL_USERNAME=notificaciones@boozlaboratorio.com
  MAIL_PASSWORD="password_de_aplicacion"
  MAIL_ENCRYPTION=tls
  MAIL_FROM_ADDRESS="notificaciones@boozlaboratorio.com"
  MAIL_FROM_NAME="Booz Laboratorio Alertas"
  ```
- **Impacto:** Permite que las alertas de Farmacovigilancia Grave (`🚨 [URGENTE INH]`) y los nuevos leads comerciales se envíen automáticamente a las casillas del Director Técnico y Administración.

### [ ] 3. Webhook de Alertas Inmediatas para Telegram o Slack (Opcional)
- **Ubicación:** Variable `ADMIN_ALERT_WEBHOOK_URL` en `.env`.
- **Acción:** Crear un Webhook entrante en un canal de Telegram o Slack de la directiva y agregarlo al `.env`.
- **Impacto:** Notificaciones instantáneas al teléfono del equipo cada vez que un paciente o médico reporte una sospecha de reacción adversa o solicite cotización al mayor.

### [ ] 4. Carga de Fotografías Reales Adicionales de Estudio (Opcional)
- **Ubicación:** [`/admin/products`](http://localhost:8000/admin/products) (pestaña *Editor de Fichas Médicas & Landing Page*).
- **Acción:** Al contar con nuevas fotografías de alta resolución de los estuches o tubos que faltan, subirlas o seleccionarlas con 1-clic desde la galería interactiva.

---

## 🔮 3. Roadmap de Mejoras Futuras (Fase Post-Lanzamiento)

### 1. Interacción por Voz con Lira Asistente Virtual (Speech-to-Text)
- Incorporar reconocimiento de voz nativo en el navegador (Web Speech API) dentro del modal interactivo de Lira (`lira-assistant-modal.tsx`).
- Permitir a pacientes de edad avanzada o con dificultades motrices presionar un botón de micrófono para dictar su consulta médica o solicitud de medicamento por audio.

### 2. Portal B2B para Clínicas y Farmacias con Acceso por Cuenta
- Permitir a farmacias aliadas y distribuidores registrarse con su RIF, iniciar sesión y ver su historial de cotizaciones pasadas, estatus de despacho de guías de envío y facturas comerciales.

---

## 🛠️ 4. Procedimiento de Despliegue en Servidor Web (Hosting / VPS)

Cuando se proceda a publicar la plataforma en el dominio final (`www.boozlaboratorio.com`):

1. **Subir Código y Configurar Entorno:**
   ```bash
   git clone <repo_url> /var/www/boozlab
   cd /var/www/boozlab
   cp .env.example .env
   composer install --no-dev --optimize-autoloader
   npm ci
   npm run build
   ```
2. **Generar Clave de Aplicación y Migraciones:**
   ```bash
   php artisan key:generate
   php artisan migrate --force
   php artisan db:seed --force
   ```
3. **Enlaces Simbólicos y Permisos de Almacenamiento:**
   ```bash
   php artisan storage:link
   chmod -R 775 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```
4. **Optimización de Cachés de Producción:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
5. **Certificado SSL y Servidor Web:**
   - Configurar Nginx / Apache apuntando el DocumentRoot a `/public`.
   - Activar certificado SSL HTTPS mediante Let's Encrypt (`certbot --nginx -d boozlaboratorio.com`).
