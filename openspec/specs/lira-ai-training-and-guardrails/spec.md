# Lira AI Training Knowledge Base and Guardrails Specification

## Purpose
Proveer un sistema integral de entrenamiento documental RAG (Retrieval-Augmented Generation) y control de contención sanitaria para la asistente científica Lira AI de Booz Laboratorio, permitiendo a los administradores cargar documentos técnicos (vademécum maestro, protocolos de farmacovigilancia INH, manuales de cotización y logística), gestionar reglas de comportamiento sanitario y probar el modelo mediante un simulador en vivo.

## Requirements

### Requirement: Gestión de Documentos de Entrenamiento RAG
El sistema SHALL permitir al Super Administrador crear, editar, alternar (activar/desactivar), previsualizar y eliminar documentos de conocimiento documental que enriquecen el contexto operativo de Lira AI.

#### Scenario: Carga de documento de entrenamiento clínico
- **WHEN** el Super Administrador envía un documento mediante `POST /admin/ai/documents`
- **THEN** el sistema registra el documento en `ai_knowledge_documents`, calcula su volumen en bytes e invalida el caché de inferencia para incorporarlo de inmediato al entrenamiento de Lira

#### Scenario: Desactivación temporal de documento en el corpus
- **WHEN** el Super Administrador invoca `POST /admin/ai/documents/{id}/toggle`
- **THEN** el documento pasa a estado inactivo y se excluye automáticamente de las futuras consultas del LLM

### Requirement: Guardrails Sanitarios Configurables
El sistema SHALL permitir definir y gestionar reglas de contención clasificadas en bloqueo estricto, advertencia sanitaria obligatoria y derivación a soporte humano, protegiendo los guardrails estructurales de sistema contra borrado accidental.

#### Scenario: Creación de guardrail de restricción comercial o clínica
- **WHEN** el Super Administrador registra un nuevo guardrail en `POST /admin/ai/guardrails`
- **THEN** la regla se almacena en `ai_guardrails` y se inyecta como directriz prioritaria para el modelo

#### Scenario: Intento de eliminación de guardrail de sistema
- **WHEN** se intenta eliminar un guardrail marcado como `is_system = true`
- **THEN** el sistema rechaza la operación con mensaje de error impidiendo desproteger la seguridad clínica

### Requirement: Simulador Interactivo Playground
El sistema SHALL proveer una consola de prueba interactiva en `/admin/ai/test` para comprobar la inferencia de Lira AI con todo el corpus documental y los guardrails activos ensamblados en tiempo real.

#### Scenario: Ejecución de prueba en el simulador
- **WHEN** el Super Administrador envía una consulta de prueba
- **THEN** el sistema retorna la respuesta procesada junto con la latencia en milisegundos y la fuente de inferencia utilizada
