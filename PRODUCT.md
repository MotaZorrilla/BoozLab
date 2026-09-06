# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Profesionales Médicos y Farmacéuticos:** Dermatólogos, pediatras, médicos generales y boticarios que consultan vademécum, dosificación pediátrica, posología y fichas técnicas oficiales.
- **Pacientes y Familias:** Personas buscando soluciones terapéuticas dermatológicas, alivio tópico o bienestar, interactuando con Lira AI o solicitando pedidos y cotizaciones vía WhatsApp.
- **Autoridades Sanitarias (INH):** Inspectores y reguladores que auditan farmacovigilancia, reportes de eventos adversos (tickets correlativos `BOOZ-FV-YYYY-XXXX`) y trazabilidad de lotes.
- **Equipo Interno de Booz Laboratorio:** Directiva y personal que gestiona catálogo, telemetría, tráfico del servidor y reportes sanitarios.

## Product Purpose
Plataforma clínica digital y vademécum interactivo para **Booz Laboratorio C.A.** (RIF J-40906185-0, Valle de Guanape, Anzoátegui, Venezuela). Facilita el acceso riguroso a la información farmacológica de 18 productos tópicos y nutricionales, herramientas de dosificación clínica, canal oficial de farmacovigilancia y enlace directo con farmacias y especialistas.

## Positioning
Laboratorio farmacéutico con manufactura nacional certificada que combina rigor clínico, asistencia digital interactiva (Lira AI) y contacto directo sin fricción. No es un e-commerce genérico: es una plataforma de salud respaldada por evidencia científica, trazabilidad y cumplimiento regulatorio en tiempo real.

## Operating Context
- **Vistas Públicas (Modo Persuade / Experience):** Portada (`home.tsx`), Vademécum (`cases.tsx`), Fichas de Producto (`product-detail.tsx`), Blog científico y Glosario.
- **Herramientas Clínicas (Modo Operate / Read):** Calculadora pediátrica (reglas de Clark y Young), canal de Farmacovigilancia regulatorio INH.
- **Panel Administrativo (Modo Operate):** Dashboard administrativo (`/admin/*`) con métricas zero-latency, telemetría de tráfico, embudo multicanal y gestión de lotes.

## Capabilities and Constraints
- **Directriz Ética de No-Automedicación:** Ningún componente ni asistente emite prescripciones concluyentes. Disclaimers sanitarios siempre presentes.
- **Integridad Farmacológica:** Fórmulas y principios activos reales según documentación técnica oficial de planta (Bactrocis, Betamer, Aciclomer, Dexamer, Albemer, etc.).
- **Stack Técnico:** Laravel 12 + Inertia.js v2 + React 19 + TypeScript + Tailwind CSS v4 + Wayfinder.
- **Rendimiento:** Telemetría Zero-Latency en servidor sin impacto en el tiempo de carga del usuario.

## Brand Commitments
- **Paleta Oficial:** Azul Marino Booz (`#002072` / PANTONE 2747 C), Borgoña Clínico (`#842D44` / PANTONE 506 C), Cyan Médico (`#06B6D4`) y Blanco Perla.
- **Mascota Oficial:** Lira (personaje 3D con orejas azules, medalla grabada BOOZ y fondo transparente, enmarcada con podios de alto contraste).
- **Anti-referencias Absolutas:** Prohibidos los degradados violeta/morados de IA, tarjetas dentro de tarjetas, textos con gradiente artificial (`bg-clip-text`), bordes laterales tipo side-tab (`border-l-4`) y sombras flotantes excesivas.

## Product Principles
1. **Rigor Clínico sobre Artificio:** La estética debe comunicar confianza médica, precisión farmacéutica y sobriedad científica.
2. **Acción Inmediata y Clara:** El médico o paciente encuentra la posología o contacta por WhatsApp en un solo clic.
3. **Cero AI-Slop:** La interfaz debe proyectar una corporación farmacéutica de clase mundial, no una plantilla de IA.
4. **Privacidad y Cumplimiento:** Respeto a la privacidad (sin cookies intrusivas) y canal INH seguro.
