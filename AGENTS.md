# 🤖 AI Agent Profile & Development Guidelines - Booz Laboratorio

Este documento actúa como guía de inducción, perfil de ingeniería y compendio de mejores prácticas para los agentes de Inteligencia Artificial y desarrolladores que trabajen en este repositorio. Define las directrices técnicas, la filosofía de desarrollo y la metodología de aseguramiento de calidad (QA) de **Booz Laboratorio (Clinical AI Platform)**.

---

## ⚖️ 1. Filosofía de Desarrollo y Testing Farmacéutico

En el sector farmacéutico y clínico, la integridad de los datos, la precisión en las dosis y el cumplimiento normativo son de máxima prioridad. Adoptamos un enfoque pragmático del testing enfocado en **prevenir la incertidumbre, validar límites clínicos y habilitar el refactoring seguro**.

### 1.1 Objetivo del Testing
*   **Malla de Seguridad Clínica:** Las pruebas deben actuar como una red protectora que detecte errores en cálculos posológicos, enrutamiento de productos y persistencia de reportes antes de que lleguen a los usuarios finales o profesionales de la salud.
*   **Contratos Públicos Estables:** Un cambio o refactorización de código no debe alterar los contratos públicos (APIs, respuestas de cálculo o props de Inertia) a menos que la especificación médica haya cambiado explícitamente.

### 1.2 Tipologías de Tests y Priorización (El Trofeo de Testing)
*   **Pruebas de Integración / Feature (Prioridad Alta):** Son el núcleo del aseguramiento de calidad. Verifican el comportamiento conjunto de enrutamiento HTTP, validadores de FormRequests, modelos Eloquent y persistencia en base de datos (ej. creación de productos, sumisión de reportes de farmacovigilancia, búsquedas en catálogo).
*   **Pruebas Unitarias (Prioridad Alta para Fórmulas):** Se reservan para lógica matemática pura (ej. cálculos de dosis pediátricas con la regla de Clark, conversiones de concentración mg/kg/día).
*   **Pruebas de Guardrails Éticos (Prioridad Alta):** Verifican que los endpoints del asistente virtual IA rechacen responder con prescripciones directas y mantengan el disclaimer obligatorio contra la automedicación.

### 1.3 Entornos Reales vs. Mocks Artificiales
*   **Evitar Mocks Excesivos:** Siempre probamos contra bases de datos reales en SQLite en memoria o persistente, pobladas mediante seeders deterministas. Esto garantiza que restricciones de integridad referencial, tipos de datos, longitudes de campos e índices se validen en cada prueba.

### 1.4 Enfoque en "Unhappy Paths" y Validación de Fronteras
*   **Unhappy Paths First:** Es prioritario escribir pruebas para datos corruptos, cadenas vacías, números negativos en dosis o pesos, severidades de farmacovigilancia inválidas y accesos no autorizados al panel administrativo antes de verificar los casos ideales.

---

## 🛠️ 2. Convenciones Técnicas Específicas de BoozLab

1.  **Framework de Testing:** Este proyecto utiliza **PHPUnit 11** de forma oficial (según las directrices de `GEMINI.md`). Todas las pruebas se escriben como clases PHPUnit heredando de `Tests\TestCase`.
2.  **Ejecución de Pruebas:**
    ```bash
    php artisan test --compact
    ```
    O para una prueba puntual:
    ```bash
    php artisan test --compact --filter=NombreDeLaPrueba
    ```
3.  **Formateo de Código:** Todo cambio en PHP debe formatearse utilizando Laravel Pint:
    ```bash
    vendor/bin/pint --dirty
    ```
4.  **Preservación de Seeders de Dominio:** Toda modificación o añadido a las tablas de la base de datos debe reflejarse en `DatabaseSeeder.php` y en las factorías correspondientes para asegurar datos realistas y deterministas.
5.  **Directriz de No-Automedicación:** Bajo ninguna circunstancia el asistente de IA o las vistas públicas deben prescribir tratamientos o emitir diagnósticos concluyentes. Siempre debe incluirse el disclaimer médico legal.
6.  **Conservación de Memoria Histórica:** Nunca borrar fases ni registros completados en `MASTER_PLAN.md` ni `HISTORY.md`. Las nuevas iniciativas se entrelazan de forma aditiva.

---

## 📊 3. Reglas de Oro para Agentes de IA

1.  **Cero Código sin Pruebas:** Cada nuevo endpoint, controlador o regla de cálculo debe contar con su correspondiente Feature / Unit Test.
2.  **Verificación Previa al Cierre:** Nunca des por concluida una sesión de trabajo sin haber verificado que la suite completa de pruebas esté en verde:
    ```bash
    php artisan test
    ```
3.  **Compilación Frontend:** Asegurar que los componentes de TypeScript/React compilen sin errores con `npm run build`.
4.  **Integridad de Datos Farmacéuticos:** No inventar principios activos ni indicaciones. Utilizar siempre los datos oficiales del documento maestro `A.docx` y de los estuches registrados.
