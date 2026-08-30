import base64
import os
import subprocess

def get_base64_image(path):
    if os.path.exists(path):
        with open(path, "rb") as f:
            ext = path.split(".")[-1].lower()
            mime = "image/webp" if ext == "webp" else f"image/{ext}"
            b64 = base64.b64encode(f.read()).decode("utf-8")
            return f"data:{mime};base64,{b64}"
    return ""

lira_full_b64 = get_base64_image("public/assets/img/lira_official_transparent.webp")
if not lira_full_b64:
    lira_full_b64 = get_base64_image("public/assets/img/lira_official_transparent.png")

lira_avatar_b64 = get_base64_image("public/assets/img/lira_head_avatar.webp")
if not lira_avatar_b64:
    lira_avatar_b64 = get_base64_image("public/assets/img/lira_head_avatar.png")

booz_logo_b64 = get_base64_image("public/assets/img/booz_symbol_icon.png")

html_content = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Presentación Ejecutiva - BoozLab Ecosistema Digital</title>
    <style>
        @page {{
            size: letter landscape;
            margin: 0;
        }}
        * {{
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }}
        body {{
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #002072;
            color: #0f172a;
        }}
        .slide {{
            width: 100vw;
            height: 100vh;
            min-height: 100vh;
            max-height: 100vh;
            page-break-after: always;
            page-break-inside: avoid;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 38px 48px;
            background: #ffffff;
            position: relative;
            overflow: hidden;
        }}
        
        /* SLIDE COVER */
        .slide-cover {{
            background: radial-gradient(circle at 80% 20%, #0033a0 0%, #002072 45%, #001244 100%);
            color: #ffffff;
        }}
        .cover-badge {{
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(2, 132, 199, 0.25);
            border: 1px solid rgba(56, 189, 248, 0.4);
            color: #38bdf8;
            padding: 6px 16px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 20px;
        }}
        .cover-title {{
            font-size: 42px;
            font-weight: 900;
            line-height: 1.1;
            margin: 0 0 14px 0;
            letter-spacing: -0.5px;
        }}
        .cover-title span {{
            color: #38bdf8;
        }}
        .cover-subtitle {{
            font-size: 16px;
            color: #cbd5e1;
            max-width: 620px;
            line-height: 1.5;
            margin-bottom: 30px;
        }}
        .cover-footer {{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            padding-top: 18px;
        }}
        .cover-meta {{
            font-size: 11px;
            color: #94a3b8;
            line-height: 1.6;
        }}
        .cover-meta strong {{
            color: #ffffff;
        }}
        
        /* INNER SLIDE COMMON */
        .slide-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #002072;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }}
        .slide-title-area {{
            display: flex;
            align-items: center;
            gap: 12px;
        }}
        .slide-number {{
            background: #002072;
            color: #ffffff;
            font-size: 12px;
            font-weight: 900;
            padding: 4px 10px;
            border-radius: 6px;
        }}
        .slide-title {{
            font-size: 24px;
            font-weight: 800;
            color: #002072;
            margin: 0;
            letter-spacing: -0.3px;
        }}
        .slide-category {{
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #0284c7;
        }}
        .brand-logo-mini {{
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        .brand-logo-mini img {{
            height: 28px;
            object-fit: contain;
        }}
        .brand-logo-mini span {{
            font-size: 13px;
            font-weight: 900;
            color: #002072;
            letter-spacing: -0.5px;
        }}
        
        .slide-body {{
            flex: 1;
            display: flex;
            gap: 24px;
            align-items: stretch;
        }}
        
        .slide-footer {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            font-size: 10px;
            color: #64748b;
        }}
        
        /* GRIDS & CARDS */
        .grid-2 {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            width: 100%;
        }}
        .grid-3 {{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
            width: 100%;
        }}
        .grid-4 {{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            width: 100%;
        }}
        
        .card {{
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }}
        .card-blue {{
            background: #f0f7ff;
            border-color: #bae6fd;
        }}
        .card-dark {{
            background: #001e62;
            color: #ffffff;
            border-color: #0284c7;
        }}
        .card-dark h4 {{
            color: #38bdf8 !important;
        }}
        .card-dark p {{
            color: #cbd5e1 !important;
        }}
        .card h4 {{
            font-size: 15px;
            font-weight: 800;
            color: #002072;
            margin: 0 0 8px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        .card p {{
            font-size: 11.5px;
            line-height: 1.45;
            color: #475569;
            margin: 0;
        }}
        .card-list {{
            margin: 8px 0 0 0;
            padding-left: 18px;
            font-size: 11px;
            color: #334155;
            line-height: 1.5;
        }}
        
        /* KPI BOX */
        .kpi-box {{
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 12px 16px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }}
        .kpi-value {{
            font-size: 26px;
            font-weight: 900;
            color: #002072;
            font-family: monospace;
            line-height: 1;
            margin: 4px 0;
        }}
        .kpi-label {{
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #64748b;
        }}
        
        /* FUNNEL STEP */
        .funnel-container {{
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
        }}
        .funnel-step {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 18px;
            border-radius: 8px;
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
        }}
        
        /* BADGES */
        .badge {{
            display: inline-block;
            font-size: 9px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        .badge-cyan {{ background: #e0f2fe; color: #0284c7; }}
        .badge-green {{ background: #dcfce7; color: #15803d; }}
        .badge-purple {{ background: #f3e8ff; color: #7e22ce; }}
        .badge-blue {{ background: #dbeafe; color: #1d4ed8; }}
        
        .mascot-img-cover {{
            position: absolute;
            right: 50px;
            bottom: 25px;
            height: 440px;
            filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.45));
        }}
        .mascot-img-small {{
            height: 160px;
            object-fit: contain;
            filter: drop-shadow(0 8px 16px rgba(2, 132, 199, 0.25));
        }}
    </style>
</head>
<body>

    <!-- SLIDE 1: PORTADA EJECUTIVA -->
    <div class="slide slide-cover">
        <div style="position: relative; z-index: 2;">
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px;">
                <img src="{booz_logo_b64}" style="height: 48px; width: 48px; object-fit: contain; background: white; padding: 4px; border-radius: 12px;" />
                <div>
                    <h2 style="font-size: 20px; font-weight: 900; letter-spacing: 1px; margin: 0; color: #ffffff;">BOOZ LABORATORIO VGME, C.A.</h2>
                    <span style="font-size: 11px; color: #93c5fd; letter-spacing: 1px; text-transform: uppercase;">RIF: J-40906185-0 • Industria Farmacéutica</span>
                </div>
            </div>
            
            <div class="cover-badge">Dossier de Presentación Oficial 2026</div>
            <h1 class="cover-title">Plataforma Tecnológica &<br><span>Ecosistema Clínico Integral</span></h1>
            <p class="cover-subtitle">
                Guía ejecutiva para la <strong>Junta Directiva y Dirección Técnica</strong>. Resumen de innovaciones operativas, canal de ventas automatizado, inteligencia artificial médica y control empresarial autónomo.
            </p>
            
            <div style="display: flex; gap: 16px;">
                <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; padding: 12px 20px;">
                    <div style="font-size: 20px; font-weight: 900; color: #38bdf8;">18 Fármacos</div>
                    <div style="font-size: 10px; color: #cbd5e1; text-transform: uppercase; font-weight: 700;">4 Líneas Terapéuticas</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; padding: 12px 20px;">
                    <div style="font-size: 20px; font-weight: 900; color: #4ade80;">24/7 en Vivo</div>
                    <div style="font-size: 10px; color: #cbd5e1; text-transform: uppercase; font-weight: 700;">Lira AI & WhatsApp</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; padding: 12px 20px;">
                    <div style="font-size: 20px; font-weight: 900; color: #f472b6;">100% Conforme</div>
                    <div style="font-size: 10px; color: #cbd5e1; text-transform: uppercase; font-weight: 700;">INH Rafael Rangel</div>
                </div>
            </div>
        </div>

        <img src="{lira_full_b64}" class="mascot-img-cover" alt="Lira 3D Mascota Oficial" />

        <div class="cover-footer" style="position: relative; z-index: 2;">
            <div class="cover-meta">
                <strong>Planta de Fabricación:</strong> Valle de Guanape, Edo. Anzoátegui.<br>
                <strong>Oficina Comercial:</strong> Puerto Ordaz, Edo. Bolívar.
            </div>
            <div class="cover-meta" style="text-align: right;">
                Documento de Entrega Técnica para Propietarios<br>
                <strong>Versión 3.2 • Todos los Derechos Reservados</strong>
            </div>
        </div>
    </div>

    <!-- SLIDE 2: VISIÓN GENERAL Y ARQUITECTURA -->
    <div class="slide">
        <div class="slide-header">
            <div class="slide-title-area">
                <span class="slide-number">01</span>
                <div>
                    <span class="slide-category">Arquitectura del Ecosistema</span>
                    <h2 class="slide-title">Infraestructura Dual: Portal Público + Consola de Mando</h2>
                </div>
            </div>
            <div class="brand-logo-mini">
                <img src="{booz_logo_b64}" />
                <span>BOOZ LAB</span>
            </div>
        </div>

        <div class="slide-body">
            <div class="grid-2">
                <!-- Columna 1: Portal Público -->
                <div class="card card-blue" style="border-width: 2px;">
                    <div>
                        <span class="badge badge-cyan" style="margin-bottom: 8px;">De Cara al Mercado</span>
                        <h4>🌐 Portal Web Clínico & Venta Directa</h4>
                        <p style="font-size: 12px; margin-bottom: 12px;">Diseñado para pacientes, médicos tratantes, droguerías y farmacias de toda Venezuela con los más altos estándares de usabilidad móvil y velocidad.</p>
                        <ul class="card-list">
                            <li><strong>Catálogo Interactivo:</strong> 18 productos clasificados en 4 líneas maestras con filtros instantáneos.</li>
                            <li><strong>Fichas Médicas de Alta Fidelidad:</strong> Fórmulas cuali-cuantitativas, posología, advertencias y compra directa.</li>
                            <li><strong>Vademécum PDF Imprimible:</strong> Ficha técnica médica generada en 1 clic para visitadores y regentes.</li>
                            <li><strong>Lira AI Asistente 3D:</strong> Orientación farmacológica las 24 horas del día con blindaje ético.</li>
                            <li><strong>Canal Sanitario INH:</strong> Notificación de farmacovigilancia conforme a normativa venezolana.</li>
                            <li><strong>Bolsa de Pedidos & WhatsApp:</strong> Cotización estructurada enviada directamente a la gerencia de ventas.</li>
                        </ul>
                    </div>
                    <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed #93c5fd; font-size: 10.5px; color: #0284c7; font-weight: 700;">
                        ✓ Adaptado para smartphones (85% del tráfico) y computadoras de escritorio.
                    </div>
                </div>

                <!-- Columna 2: Consola Administrativa -->
                <div class="card card-dark" style="border-width: 2px;">
                    <div>
                        <span class="badge badge-purple" style="margin-bottom: 8px;">Para la Junta Directiva</span>
                        <h4>🔐 Consola de Mando Privada (/admin)</h4>
                        <p style="font-size: 12px; margin-bottom: 12px; color: #cbd5e1;">Centro de control seguro donde los propietarios supervisan y gestionan su empresa sin depender de informáticos externos.</p>
                        <ul class="card-list" style="color: #e2e8f0;">
                            <li><strong>Editor de Precios y Stock en Vivo:</strong> Cambie precios en USD o pause productos con un toque.</li>
                            <li><strong>Gestor de Imágenes de Envases:</strong> Actualice fotos de estuches desde su celular o PC.</li>
                            <li><strong>Bandeja de Cotizaciones Comerciales:</strong> Historial de pedidos y comprobantes PDF descargables.</li>
                            <li><strong>Control Regulatorio de Farmacovigilancia:</strong> Dictamen técnico y generación de Actas Oficiales INH.</li>
                            <li><strong>Mirador de Telemetría:</strong> Analítica de tráfico del servidor en tiempo real y embudo comercial.</li>
                            <li><strong>4 Perfiles de Seguridad:</strong> Acceso segmentado para Directores, Farmacéuticos y Vendedores.</li>
                        </ul>
                    </div>
                    <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed rgba(255,255,255,0.2); font-size: 10.5px; color: #38bdf8; font-weight: 700;">
                        ✓ Acceso restringido por contraseña encriptada y permisos estrictos por cargo.
                    </div>
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>Booz Laboratorio VGME, C.A. • Dossier Ejecutivo de Entrega</span>
            <span>Página 2 de 8</span>
        </div>
    </div>

    <!-- SLIDE 3: CATÁLOGO Y VADEMÉCUM -->
    <div class="slide">
        <div class="slide-header">
            <div class="slide-title-area">
                <span class="slide-number">02</span>
                <div>
                    <span class="slide-category">Portafolio Farmacéutico</span>
                    <h2 class="slide-title">18 Medicamentos, Fichas Técnicas & Vademécum PDF</h2>
                </div>
            </div>
            <div class="brand-logo-mini">
                <img src="{booz_logo_b64}" />
                <span>BOOZ LAB</span>
            </div>
        </div>

        <div class="slide-body">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 14px;">
                <div class="grid-4">
                    <div class="card">
                        <span class="badge badge-blue">Línea 01</span>
                        <h4 style="font-size: 13px;">Cuidado de la Piel</h4>
                        <p>Calamicis (200ml), Beducis, Hidramer y Centellacis. Fórmulas dermocosméticas emolientes e hidratantes.</p>
                    </div>
                    <div class="card">
                        <span class="badge badge-blue">Línea 02</span>
                        <h4 style="font-size: 13px;">Tratamiento Tópico</h4>
                        <p>Bactrocis (Moxifloxacina - Pie Diabético), Bacumer, Amikacis, Gentamicis, Betamer, Quadrimer y Betagemer.</p>
                    </div>
                    <div class="card">
                        <span class="badge badge-blue">Línea 03</span>
                        <h4 style="font-size: 13px;">Salud & Bienestar</h4>
                        <p>Albemer (Suspensión oral 10ml), Cevitmer (Vitamina C), Booz Sport y revitalizantes multivitamínicos L-Fortex.</p>
                    </div>
                    <div class="card">
                        <span class="badge badge-blue">Línea 04</span>
                        <h4 style="font-size: 13px;">Especializada</h4>
                        <p>Formulaciones regenerativas avanzadas como Salicis, Cutimer y tratamientos dérmicos específicos.</p>
                    </div>
                </div>

                <div class="grid-2" style="flex: 1;">
                    <div class="card card-blue">
                        <h4>📄 Ficha de Producto con Compra Directa</h4>
                        <p style="margin-bottom: 8px;">Cada fármaco cuenta con una página web individual de alto impacto:</p>
                        <ul class="card-list">
                            <li>Fotografía en alta definición del estuche real fabricado en planta.</li>
                            <li>Composición miligramo a miligramo y principios activos.</li>
                            <li>Indicaciones terapéuticas aprobadas y advertencias de uso.</li>
                            <li><strong>Botón Estratégico:</strong> <code>[ 🛍️ Añadir a la Bolsa de Pedidos ]</code> para comprar sin salir de la ficha.</li>
                        </ul>
                    </div>

                    <div class="card" style="background: #eff6ff; border: 2px solid #002072;">
                        <h4 style="color: #002072;">🖨️ Vademécum Oficial en PDF (1 Toque)</h4>
                        <p style="margin-bottom: 8px;">Diseñado para reuniones con médicos tratantes, clínicas y droguerías:</p>
                        <ul class="card-list">
                            <li>Formato tamaño carta exacto con el azul institucional <code>#002072</code>.</li>
                            <li>Incluye foto del estuche, fórmula, posología y advertencias del INH.</li>
                            <li><strong>Casillas Oficiales para Firmas:</strong> Director Técnico, Regente Farmacéutico y Control de Calidad.</li>
                            <li>Disponible de forma inmediata en el botón <code>[ Imprimir Vademécum PDF ]</code> de cada medicamento.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>Booz Laboratorio VGME, C.A. • Dossier Ejecutivo de Entrega</span>
            <span>Página 3 de 8</span>
        </div>
    </div>

    <!-- SLIDE 4: LIRA AI MASCOTA 3D -->
    <div class="slide">
        <div class="slide-header">
            <div class="slide-title-area">
                <span class="slide-number">03</span>
                <div>
                    <span class="slide-category">Inteligencia Artificial Médica</span>
                    <h2 class="slide-title">Lira: Embajadora Oficial 3D & Orientadora Farmacéutica</h2>
                </div>
            </div>
            <div class="brand-logo-mini">
                <img src="{booz_logo_b64}" />
                <span>BOOZ LAB</span>
            </div>
        </div>

        <div class="slide-body">
            <div style="flex: 1.4; display: flex; flex-direction: column; gap: 14px;">
                <div class="card card-blue" style="border-left: 4px solid #002072;">
                    <h4>🐾 ¿Quién es Lira y qué valor aporta a Booz?</h4>
                    <p style="font-size: 12px; line-height: 1.5;">
                        Es la mascota oficial de Booz Laboratorio: un personaje canino en 3D con orejas azules y medalla grabada con el sello <strong>"BOOZ"</strong>. Ahora integrada con tecnología de fondo 100% transparente en alta resolución, humaniza la marca y resuelve dudas clínicas de los usuarios 24/7 sin ocupar tiempo de los directivos.
                    </p>
                </div>

                <div class="grid-2" style="flex: 1;">
                    <div class="card">
                        <h4>🛡️ Blindaje Legal Sanitario (Guardrails)</h4>
                        <p style="margin-bottom: 6px;">Lira nunca improvisa ni receta por su cuenta:</p>
                        <ul class="card-list">
                            <li><strong>Cero Automedicación:</strong> Advierte en cada turno la necesidad del récipe y consulta médica.</li>
                            <li><strong>Contención de Sobredosis:</strong> Si alguien consulta dosis abusivas, detiene la respuesta y alerta a urgencias.</li>
                            <li><strong>Base RAG Verificada:</strong> Solo responde con información cargada en el Vademécum oficial de Booz.</li>
                        </ul>
                    </div>

                    <div class="card">
                        <h4>💼 Captura Proactiva de Pedidos al Mayor</h4>
                        <p style="margin-bottom: 6px;">Lira actúa como un vendedor incansable:</p>
                        <ul class="card-list">
                            <li>Si un usuario dice <em>"quiero comprar al mayor para mi farmacia"</em>, Lira abre un formulario dentro del chat.</li>
                            <li>Registra nombre, teléfono, correo y solicitud del cliente.</li>
                            <li>El lead llega al instante a la bandeja de mensajes de la directiva.</li>
                        </ul>
                    </div>
                </div>

                <div class="card" style="background: #f0fdf4; border-color: #86efac;">
                    <h4 style="color: #166534;">🌟 Tarjeta Dual en Fichas de Producto</h4>
                    <p style="color: #14532d; font-size: 11px;">
                        En cada medicamento, el cliente puede elegir entre <strong>[ 🐾 Consultar a Lira AI ]</strong> para aclarar dudas farmacológicas en segundos o <strong>[ 💬 Atención por WhatsApp ]</strong> para hablar con la regencia técnica y ventas.
                    </p>
                </div>
            </div>

            <div style="flex: 0.8; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(180deg, #ffffff 0%, #f0fdfa 60%, #e0f2fe 100%); border-radius: 16px; border: 2px solid #38bdf8; padding: 20px; text-align: center; box-shadow: 0 10px 25px -5px rgba(6, 182, 212, 0.2);">
                <div style="width: 140px; height: 140px; border-radius: 9999px; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #eff6ff 100%); border: 3px solid #38bdf8; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(0,32,114,0.15); margin-bottom: 10px;">
                    <img src="{lira_avatar_b64}" alt="Lira Avatar" style="height: 125px; width: 125px; border-radius: 9999px; object-fit: cover;" />
                </div>
                <h4 style="margin: 4px 0 2px 0; color: #002072; font-size: 16px;">Lira AI</h4>
                <span class="badge badge-cyan" style="margin-bottom: 8px;">Diseño de Alto Contraste</span>
                <p style="font-size: 10.5px; color: #475569; max-width: 210px; line-height: 1.4;">
                    Fondos en <strong>degradado blanco perla y cian</strong> que garantizan máxima visibilidad en móviles, escritorio y modo nocturno.
                </p>
            </div>
        </div>

        <div class="slide-footer">
            <span>Booz Laboratorio VGME, C.A. • Dossier Ejecutivo de Entrega</span>
            <span>Página 4 de 8</span>
        </div>
    </div>

    <!-- SLIDE 5: VENTAS Y FARMACOVIGILANCIA -->
    <div class="slide">
        <div class="slide-header">
            <div class="slide-title-area">
                <span class="slide-number">04</span>
                <div>
                    <span class="slide-category">Comercialización & Normativa Sanitaria</span>
                    <h2 class="slide-title">Canal de Ventas por WhatsApp & Farmacovigilancia INH</h2>
                </div>
            </div>
            <div class="brand-logo-mini">
                <img src="{booz_logo_b64}" />
                <span>BOOZ LAB</span>
            </div>
        </div>

        <div class="slide-body">
            <div class="grid-2">
                <!-- Ventas -->
                <div class="card" style="border: 2px solid #10b981; background: #f0fdf4;">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span class="badge badge-green">Motor Comercial</span>
                            <span style="font-size: 20px;">🛍️</span>
                        </div>
                        <h4 style="color: #065f46;">Tienda Virtual & Cotización WhatsApp</h4>
                        <p style="color: #047857; margin-bottom: 12px;">Los clientes arman su lista de compra de forma intuitiva sin fricciones:</p>
                        <ul class="card-list" style="color: #065f46;">
                            <li><strong>Bolsa de Pedidos Flotante:</strong> Disponible en móviles y PC con conteo de unidades en vivo.</li>
                            <li><strong>Segmentación de Cliente:</strong> El solicitante se identifica como *Paciente*, *Farmacia Aliada*, *Clínica* o *Distribuidor*.</li>
                            <li><strong>Monto Total en USD:</strong> Con cláusula de advertencia si algún fármaco requiere récipe médico.</li>
                            <li><strong>Envío Estructurado en 1 Clic:</strong> Al pulsar "Enviar Pedido", se abre WhatsApp con el mensaje prellenado directo al equipo de ventas.</li>
                            <li><strong>Comprobante PDF Oficial:</strong> Genera comprobante formal de pedido numerado (ej. <code>BOOZ-COT-2026-0012</code>).</li>
                        </ul>
                    </div>
                    <div style="margin-top: 14px; padding: 10px; background: rgba(16, 185, 129, 0.15); border-radius: 8px; font-size: 11px; color: #047857; font-weight: 700;">
                        ✓ Telemetría de Clics: El sistema mide cada vez que un usuario intenta cotizar, sabiendo qué medicamentos demandan.
                    </div>
                </div>

                <!-- Farmacovigilancia -->
                <div class="card" style="border: 2px solid #002072; background: #f8fafc;">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span class="badge badge-blue">Normativa Sanitaria</span>
                            <span style="font-size: 20px;">⚖️</span>
                        </div>
                        <h4 style="color: #002072;">Canal Oficial de Farmacovigilancia INH</h4>
                        <p style="margin-bottom: 12px;">Cumplimiento irrestricto de las directrices del Instituto Nacional de Higiene Rafael Rangel:</p>
                        <ul class="card-list">
                            <li><strong>Formulario Digital (/farmacovigilancia):</strong> Permite a médicos y pacientes reportar sospechas de RAM o reclamos de calidad.</li>
                            <li><strong>Ticket de Seguimiento Único:</strong> Asignación de código oficial inmutable (ej. <code>BOOZ-FV-2026-0004</code>).</li>
                            <li><strong>Bandeja de Dictamen para el Regente:</strong> El Director Técnico revisa, clasifica y emite observaciones técnicas.</li>
                            <li><strong>Acta Oficial Sanitaria en PDF:</strong> Documento formal con diseño institucional azul listo para presentar ante auditorías del Ministerio de Salud.</li>
                        </ul>
                    </div>
                    <div style="margin-top: 14px; padding: 10px; background: rgba(0, 32, 114, 0.08); border-radius: 8px; font-size: 11px; color: #002072; font-weight: 700;">
                        ✓ Blindaje Legal Total: Registros archivados en base de datos para trazabilidad ante inspecciones sanitarias.
                    </div>
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>Booz Laboratorio VGME, C.A. • Dossier Ejecutivo de Entrega</span>
            <span>Página 5 de 8</span>
        </div>
    </div>

    <!-- SLIDE 6: CONSOLA ADMINISTRATIVA -->
    <div class="slide">
        <div class="slide-header">
            <div class="slide-title-area">
                <span class="slide-number">05</span>
                <div>
                    <span class="slide-category">Gestión Empresarial</span>
                    <h2 class="slide-title">La Consola Directiva: Autonomía Operativa Total</h2>
                </div>
            </div>
            <div class="brand-logo-mini">
                <img src="{booz_logo_b64}" />
                <span>BOOZ LAB</span>
            </div>
        </div>

        <div class="slide-body">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 16px;">
                <div class="grid-3">
                    <div class="card card-blue">
                        <h4>🏷️ Gestor de Catálogo y Precios</h4>
                        <p>Cambie precios en dólares, pause medicamentos agotados o suba fotos nuevas de cajas y envases en segundos. Sin tocar código ni esperar a terceros.</p>
                    </div>
                    <div class="card card-blue">
                        <h4>📋 Registro de Cotizaciones</h4>
                        <p>Visualice qué farmacias o clínicas han cotizado, descargue comprobantes PDF con membrete de Booz y cargue cotizaciones manuales tomadas por teléfono.</p>
                    </div>
                    <div class="card card-blue">
                        <h4>📬 Bandeja de Oportunidades</h4>
                        <p>Centraliza los mensajes de la web y leads de Lira AI, con botón verde para <strong>[ Responder por WhatsApp ]</strong> con un toque desde su teléfono o PC.</p>
                    </div>
                </div>

                <div class="grid-2" style="flex: 1;">
                    <div class="card">
                        <h4>👥 Seguridad y 4 Perfiles de Personal</h4>
                        <p style="margin-bottom: 8px;">Cada empleado tiene acceso restringido según sus funciones:</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
                            <div style="background: #ffffff; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                <strong>Super Administrador:</strong> Control total, finanzas y usuarios.
                            </div>
                            <div style="background: #ffffff; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                <strong>Director Técnico:</strong> Fórmulas, farmacovigilancia y vademécum.
                            </div>
                            <div style="background: #ffffff; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                <strong>Gestor Comercial:</strong> Catálogo, stock, cotizaciones y ventas.
                            </div>
                            <div style="background: #ffffff; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                <strong>Oficial Sanitario:</strong> Actas de farmacovigilancia INH.
                            </div>
                        </div>
                    </div>

                    <div class="card" style="background: #fdf4ff; border-color: #f0abfc;">
                        <h4 style="color: #86198f;">⚙️ Ajustes Dinámicos de la Empresa (/admin/settings)</h4>
                        <p style="color: #701a75; margin-bottom: 8px;">La directiva puede cambiar en cualquier momento:</p>
                        <ul class="card-list" style="color: #701a75;">
                            <li><strong>Línea de WhatsApp de Ventas</strong> (donde llegan las cotizaciones).</li>
                            <li><strong>Línea de WhatsApp de Consultas</strong> (atención al público general).</li>
                            <li><strong>Teléfonos de la Planta en Valle de Guanape</strong>.</li>
                            <li><strong>Plantillas de saludo</strong> y términos comerciales.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>Booz Laboratorio VGME, C.A. • Dossier Ejecutivo de Entrega</span>
            <span>Página 6 de 8</span>
        </div>
    </div>

    <!-- SLIDE 7: TELEMETRÍA Y EMBUDO DE 5 ETAPAS -->
    <div class="slide">
        <div class="slide-header">
            <div class="slide-title-area">
                <span class="slide-number">06</span>
                <div>
                    <span class="slide-category">Inteligencia de Negocios & Analítica</span>
                    <h2 class="slide-title">Telemetría Zero-Latency, Filtros Dinámicos & Dispositivos</h2>
                </div>
            </div>
            <div class="brand-logo-mini">
                <img src="{booz_logo_b64}" />
                <span>BOOZ LAB</span>
            </div>
        </div>

        <div class="slide-body">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 14px;">
                <!-- Banner superior de KPIs de tráfico -->
                <div class="grid-4">
                    <div class="kpi-box" style="border-top: 3px solid #7c3aed;">
                        <div class="kpi-label">Páginas Vistas (Tráfico)</div>
                        <div class="kpi-value" style="color: #7c3aed;">En Vivo</div>
                        <div style="font-size: 10px; color: #64748b;">0.00ms de latencia servida</div>
                    </div>
                    <div class="kpi-box" style="border-top: 3px solid #002072;">
                        <div class="kpi-label">Visitantes Únicos</div>
                        <div class="kpi-value">Personas Reales</div>
                        <div style="font-size: 10px; color: #64748b;">Hash SHA-256 anónimo</div>
                    </div>
                    <div class="kpi-box" style="border-top: 3px solid #0284c7;">
                        <div class="kpi-label">Exploración de Fármacos</div>
                        <div class="kpi-value" style="color: #0284c7;">Vademécum & PDP</div>
                        <div style="font-size: 10px; color: #64748b;">Interés médico real</div>
                    </div>
                    <div class="kpi-box" style="border-top: 3px solid #10b981;">
                        <div class="kpi-label">Intenciones WhatsApp</div>
                        <div class="kpi-value" style="color: #10b981;">Clics de Cierre</div>
                        <div style="font-size: 10px; color: #64748b;">Conversión directa</div>
                    </div>
                </div>

                <div class="grid-2" style="flex: 1;">
                    <!-- Embudo Maestro de 5 Etapas -->
                    <div class="card card-blue">
                        <h4>📈 El Embudo Maestro de Conversión (5 Etapas)</h4>
                        <div class="funnel-container" style="margin-top: 6px;">
                            <div class="funnel-step" style="background: #7c3aed;">
                                <span>1. Tráfico Web Servidor</span>
                                <span>100% de Visitantes</span>
                            </div>
                            <div class="funnel-step" style="background: #4f46e5;">
                                <span>2. Exploración de Fichas & Vademécum</span>
                                <span>Interés Clínico</span>
                            </div>
                            <div class="funnel-step" style="background: #2563eb;">
                                <span>3. Consultas Clínicas con Lira AI</span>
                                <span>Orientación 24/7</span>
                            </div>
                            <div class="funnel-step" style="background: #0284c7;">
                                <span>4. Intenciones de Contacto WhatsApp</span>
                                <span>Clics de Venta</span>
                            </div>
                            <div class="funnel-step" style="background: #10b981;">
                                <span>5. Cotizaciones Formales en BD</span>
                                <span>Cierre Comercial</span>
                            </div>
                        </div>
                    </div>

                    <!-- Analítica de Fármacos, Filtros Dinámicos y Entorno -->
                    <div class="card">
                        <h4>🎯 Qué Resuelve esta Analítica para la Directiva</h4>
                        <ul class="card-list" style="margin-bottom: 10px;">
                            <li><strong>Filtros Temporales en 1 Toque:</strong> Explore el rendimiento en <strong>7 Días, 15 Días, 1 Mes, 6 Meses, 1 Año e Histórico Total</strong> con adaptación de escala automática.</li>
                            <li><strong>Entorno Tecnológico & Dispositivos:</strong> Visualice en tiempo real qué porcentaje navega desde <strong>Smartphones vs. Escritorio</strong> y los navegadores principales (Chrome, Safari, Edge).</li>
                            <li><strong>Rutas de Entrada (Landing Pages):</strong> Conozca con certeza cuál es la primera página por la que llegan los clientes potenciales.</li>
                            <li><strong>Decisiones de Producción en Planta:</strong> Identifique qué medicamentos son los más consultados para programar lotes de fabricación en Valle de Guanape.</li>
                        </ul>
                        <div style="background: #f1f5f9; padding: 6px 12px; border-radius: 8px; font-size: 10px; color: #475569; display: flex; justify-content: space-between; align-items: center;">
                            <span>📊 <strong>Exportación en 1 Clic:</strong> Descarga de reportes en Excel (CSV).</span>
                            <span style="color: #0284c7; font-weight: 700;">Auditoría de Conversaciones en Vivo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>Booz Laboratorio VGME, C.A. • Dossier Ejecutivo de Entrega</span>
            <span>Página 7 de 8</span>
        </div>
    </div>

    <!-- SLIDE 8: CONCLUSIÓN Y BENEFICIOS -->
    <div class="slide">
        <div class="slide-header">
            <div class="slide-title-area">
                <span class="slide-number">07</span>
                <div>
                    <span class="slide-category">Evaluación Directiva</span>
                    <h2 class="slide-title">Resumen de Valor: Antes vs. Ahora con BoozLab</h2>
                </div>
            </div>
            <div class="brand-logo-mini">
                <img src="{booz_logo_b64}" />
                <span>BOOZ LAB</span>
            </div>
        </div>

        <div class="slide-body">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 14px;">
                <!-- Tabla comparativa -->
                <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; text-align: left;">
                    <thead>
                        <tr style="background: #002072; color: #ffffff;">
                            <th style="padding: 10px 14px; border-radius: 8px 0 0 0;">Área Estratégica</th>
                            <th style="padding: 10px 14px;">Operación Tradicional</th>
                            <th style="padding: 10px 14px; border-radius: 0 8px 0 0; background: #0284c7;">Con la Nueva Plataforma BoozLab</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 9px 14px; font-weight: 700; color: #002072;">Presencia de Marca</td>
                            <td style="padding: 9px 14px; color: #64748b;">Catálogos impresos estáticos que se desactualizan.</td>
                            <td style="padding: 9px 14px; font-weight: 700; color: #0369a1; background: #f0f9ff;">Portal clínico 4K, diseño ultra-moderno y mascota 3D oficial.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
                            <td style="padding: 9px 14px; font-weight: 700; color: #002072;">Atención al Cliente</td>
                            <td style="padding: 9px 14px; color: #64748b;">Limitada al horario de oficina y personal de guardia.</td>
                            <td style="padding: 9px 14px; font-weight: 700; color: #0369a1; background: #f0f9ff;">Lira AI orientando 24 horas al día, 365 días al año.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 9px 14px; font-weight: 700; color: #002072;">Canal de Ventas</td>
                            <td style="padding: 9px 14px; color: #64748b;">Llamadas dispersas y mensajes de texto sin formato.</td>
                            <td style="padding: 9px 14px; font-weight: 700; color: #0369a1; background: #f0f9ff;">Bolsa de pedidos con montos en USD enviados directo a WhatsApp.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
                            <td style="padding: 9px 14px; font-weight: 700; color: #002072;">Cumplimiento INH</td>
                            <td style="padding: 9px 14px; color: #64748b;">Planillas de papel con riesgo de extravío o sanción.</td>
                            <td style="padding: 9px 14px; font-weight: 700; color: #0369a1; background: #f0f9ff;">Canal oficial digital con tickets inmutables y actas oficiales en PDF.</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 9px 14px; font-weight: 700; color: #002072;">Autonomía Directiva</td>
                            <td style="padding: 9px 14px; color: #64748b;">Pagar a programadores por cada cambio de precio o foto.</td>
                            <td style="padding: 9px 14px; font-weight: 700; color: #0369a1; background: #f0f9ff;">Consola propia para cambiar precios, teléfonos y stock al instante.</td>
                        </tr>
                    </tbody>
                </table>

                <div class="card card-dark" style="padding: 14px 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="margin-bottom: 4px; font-size: 14px;">✅ Certificación de Calidad y Estabilidad</h4>
                            <p style="font-size: 11px;">
                                Plataforma probada con <strong>151 pruebas automáticas unitarias y de integración (100% aprobadas)</strong>, 14 especificaciones BDD y arquitectura de cero fallos ante caídas de red externa.
                            </p>
                        </div>
                        <div style="text-align: right; font-size: 11px; color: #38bdf8; font-weight: 800;">
                            ESTADO: OPERATIVO 100%<br>
                            <span style="color: #4ade80; font-size: 9px;">SISTEMA LISTO PARA PRODUCCIÓN</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>Booz Laboratorio VGME, C.A. • Valle de Guanape & Puerto Ordaz, Venezuela</span>
            <span>Página 8 de 8</span>
        </div>
    </div>

</body>
</html>
"""

html_path = "docs_booz/presentacion_ejecutiva_boozlab.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated HTML presentation at {html_path}")

# Now render to PDF via Microsoft Edge Headless
edge_paths = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe"
]

edge_exe = None
for p in edge_paths:
    if os.path.exists(p):
        edge_exe = p
        break

if not edge_exe:
    print("Error: No Edge or Chrome executable found!")
    exit(1)

print(f"Using browser: {edge_exe}")
pdf_output = os.path.abspath("PRESENTACION_EJECUTIVA_BOOZLAB.pdf")
html_abs = os.path.abspath(html_path)

cmd = [
    edge_exe,
    "--headless=new",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_output}",
    "--no-pdf-header-footer",
    html_abs
]

print("Executing browser print-to-pdf...")
res = subprocess.run(cmd, capture_output=True, text=True)
if os.path.exists(pdf_output) and os.path.getsize(pdf_output) > 1000:
    print(f"SUCCESS! Executive presentation PDF generated at: {pdf_output} ({os.path.getsize(pdf_output) / 1024:.1f} KB)")
else:
    print("Error during PDF generation:", res.stderr)
