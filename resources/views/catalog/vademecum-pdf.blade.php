@php
    use App\Services\SettingService;
    $companyName = SettingService::companyName();
    $companyRif = SettingService::companyRif();
    $plantLocation = SettingService::plantLocation();
    $officeLocation = SettingService::officeLocation();
    $salesPhone = SettingService::whatsappPhone();
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha Técnica & Vademécum - {{ $product->name }} | {{ $companyName }}</title>
    <style>
        @page {
            size: letter;
            margin: 1.2cm;
        }
        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            line-height: 1.5;
            background-color: #f8fafc;
            margin: 0;
            padding: 24px 16px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .container {
            max-width: 820px;
            margin: 0 auto;
            background: #ffffff;
            padding: 36px 40px;
            border-radius: 16px;
            box-shadow: 0 4px 25px rgba(0, 32, 114, 0.08);
            border: 1px solid #e2e8f0;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #002072;
            padding-bottom: 18px;
            margin-bottom: 20px;
        }
        .logo-area {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .logo-img {
            width: 58px;
            height: 58px;
            object-fit: contain;
        }
        .company-name {
            font-size: 20px;
            font-weight: 900;
            color: #002072;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: -0.5px;
        }
        .company-rif {
            font-size: 11px;
            color: #475569;
            font-weight: 700;
            margin: 2px 0;
        }
        .company-loc {
            font-size: 10px;
            color: #64748b;
            margin: 0;
        }
        .doc-badge {
            text-align: right;
        }
        .doc-code {
            font-size: 13px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-weight: 900;
            color: #002072;
            background: #eff6ff;
            padding: 5px 12px;
            border-radius: 6px;
            border: 1px solid #bfdbfe;
            display: inline-block;
        }
        .doc-date {
            font-size: 10px;
            color: #64748b;
            margin-top: 4px;
        }
        .doc-title-bar {
            background: linear-gradient(90deg, #002072 0%, #0369a1 100%);
            color: #ffffff;
            padding: 10px 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .doc-title-text {
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0;
        }
        .doc-category-badge {
            background: rgba(255, 255, 255, 0.2);
            font-size: 10px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        
        /* Product Hero Grid */
        .product-hero {
            display: grid;
            grid-template-columns: 240px 1fr;
            gap: 24px;
            margin-bottom: 24px;
            align-items: start;
        }
        .product-img-box {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            background: #ffffff;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.03);
        }
        .product-img {
            max-width: 100%;
            height: 210px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        }
        .product-info-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 18px 20px;
        }
        .product-name {
            font-size: 24px;
            font-weight: 900;
            color: #0f172a;
            margin: 0 0 4px 0;
            line-height: 1.2;
        }
        .active-ingredients {
            font-size: 13px;
            font-weight: 800;
            color: #0284c7;
            margin: 0 0 14px 0;
        }
        .specs-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 14px;
            font-size: 11px;
        }
        .spec-item {
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
        }
        .spec-label {
            color: #64748b;
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 700;
            margin-bottom: 2px;
        }
        .spec-value {
            color: #0f172a;
            font-weight: 800;
        }
        .rx-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 800;
        }
        .rx-badge.required {
            background: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
        }
        .rx-badge.otc {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        /* Sections */
        .section-box {
            margin-bottom: 18px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            background: #ffffff;
            page-break-inside: avoid;
        }
        .section-header {
            background: #f1f5f9;
            color: #002072;
            padding: 8px 14px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .section-body {
            padding: 12px 16px;
            font-size: 11.5px;
            color: #334155;
            line-height: 1.6;
        }
        .section-body p {
            margin: 0 0 6px 0;
        }
        .section-body p:last-child {
            margin-bottom: 0;
        }
        .warning-box {
            border-color: #fed7aa;
        }
        .warning-box .section-header {
            background: #fff7ed;
            color: #c2410c;
            border-color: #fed7aa;
        }
        
        /* Farmacovigilancia Notice */
        .pharma-notice {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 10px;
            color: #1e3a8a;
            margin-top: 18px;
            line-height: 1.5;
            page-break-inside: avoid;
        }

        /* Signatures */
        .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px dashed #cbd5e1;
            page-break-inside: avoid;
        }
        .sig-block {
            text-align: center;
        }
        .sig-line {
            width: 80%;
            margin: 0 auto 8px auto;
            border-bottom: 1px solid #94a3b8;
        }
        .sig-title {
            font-size: 11px;
            font-weight: 800;
            color: #0f172a;
        }
        .sig-sub {
            font-size: 9px;
            color: #64748b;
        }

        .footer-legal {
            margin-top: 24px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            font-size: 9px;
            color: #94a3b8;
            text-align: center;
        }

        /* Floating / Screen Action Bar */
        .action-bar {
            max-width: 820px;
            margin: 0 auto 20px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .btn {
            background: #002072;
            color: #ffffff;
            border: none;
            padding: 10px 18px;
            font-size: 13px;
            font-weight: 700;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 8px rgba(0,32,114,0.25);
            transition: opacity 0.2s;
        }
        .btn-back {
            background: #ffffff;
            color: #475569;
            border: 1px solid #cbd5e1;
            box-shadow: none;
        }
        .btn:hover {
            opacity: 0.9;
        }

        @media print {
            body {
                background-color: #ffffff;
                padding: 0;
            }
            .container {
                box-shadow: none;
                padding: 0;
                border: none;
                border-radius: 0;
                max-width: 100%;
            }
            .action-bar {
                display: none !important;
            }
        }
    </style>
</head>
<body>

    <!-- Barra de Acciones (Solo visible en pantalla) -->
    <div class="action-bar">
        <a href="/producto/{{ $product->slug }}" class="btn btn-back">← Volver a la Ficha del Producto</a>
        <button onclick="window.print()" class="btn">🖨️ Imprimir / Guardar como PDF</button>
    </div>

    <div class="container">
        <!-- Header Oficial Booz -->
        <div class="header">
            <div class="logo-area">
                <img src="/assets/img/booz_symbol_icon.png" alt="Booz Logo" class="logo-img" onerror="this.style.display='none'">
                <div>
                    <h1 class="company-name">{{ $companyName }}</h1>
                    <p class="company-rif">BOOZ LABORATORIO VGME, C.A. • RIF {{ $companyRif }}</p>
                    <p class="company-loc">Planta: {{ $plantLocation }} • Oficinas: {{ $officeLocation }}</p>
                </div>
            </div>
            <div class="doc-badge">
                <div class="doc-code">VAD-{{ strtoupper(substr($product->slug, 0, 4)) }}-{{ str_pad($product->id, 3, '0', STR_PAD_LEFT) }}</div>
                <div class="doc-date">Emisión Oficial: {{ now()->format('d/m/Y') }}</div>
            </div>
        </div>

        <!-- Título del Documento y Línea -->
        <div class="doc-title-bar">
            <h2 class="doc-title-text">VADEMÉCUM CLÍNICO & FICHA TÉCNICA SANITARIA</h2>
            <span class="doc-category-badge">
                {{ $product->productLine?->name ?: 'Línea Booz' }} (Código L{{ $product->productLine?->code ?: '01' }})
            </span>
        </div>

        <!-- Presentación del Fármaco -->
        <div class="product-hero">
            <div class="product-img-box">
                <img 
                    src="{{ asset($product->image_path) }}" 
                    alt="{{ $product->name }}" 
                    class="product-img"
                    onerror="this.src='/assets/img/product_1.png'"
                >
            </div>
            <div class="product-info-box">
                <h2 class="product-name">{{ $product->name }}</h2>
                <div class="active-ingredients">{{ $product->active_ingredients }}</div>

                <div class="specs-grid">
                    <div class="spec-item">
                        <div class="spec-label">Presentación Oficial</div>
                        <div class="spec-value">{{ $product->presentation }}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Régimen de Dispensación</div>
                        <div class="spec-value">
                            @if($product->is_prescription_required)
                                <span class="rx-badge required">Requiere Récipe Médico</span>
                            @else
                                <span class="rx-badge otc">Venta Libre (OTC)</span>
                            @endif
                        </div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Línea Terapéutica</div>
                        <div class="spec-value">{{ $product->productLine?->name ?: 'Catálogo General' }}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Precio Referencial</div>
                        <div class="spec-value" style="color: #059669;">${{ number_format((float)$product->price, 2) }} USD</div>
                    </div>
                    <div class="spec-item" style="grid-column: span 2;">
                        <div class="spec-label">Condiciones de Almacenamiento</div>
                        <div class="spec-value" style="font-size: 10.5px; font-weight: 600;">
                            Conservar a temperatura inferior a 30°C en lugar fresco y seco, protegido de la luz directa y humedad.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 1. Descripción Farmacológica -->
        <div class="section-box">
            <div class="section-header">1. Descripción Farmacológica y Características del Producto</div>
            <div class="section-body">
                <p>{{ $product->description }}</p>
            </div>
        </div>

        <!-- 2. Indicaciones Terapéuticas -->
        <div class="section-box">
            <div class="section-header">2. Indicaciones Terapéuticas y Farmacología Clínica</div>
            <div class="section-body">
                <p style="white-space: pre-line;">{{ $product->indications }}</p>
            </div>
        </div>

        <!-- 3. Posología y Administración -->
        @if($product->posology)
        <div class="section-box">
            <div class="section-header">3. Posología y Modo de Empleo</div>
            <div class="section-body">
                <p style="white-space: pre-line;">{{ $product->posology }}</p>
            </div>
        </div>
        @endif

        <!-- 4. Contraindicaciones y Precauciones -->
        @if($product->contraindications)
        <div class="section-box warning-box">
            <div class="section-header">4. Contraindicaciones, Advertencias y Precauciones</div>
            <div class="section-body">
                <p style="white-space: pre-line;">{{ $product->contraindications }}</p>
            </div>
        </div>
        @endif

        <!-- 5. Farmacovigilancia Oficial INH -->
        <div class="pharma-notice">
            <strong>🛡️ Protocolo Sanitario de Farmacovigilancia (INH Rafael Rangel):</strong>
            Booz Laboratorio VGME, C.A. mantiene un monitoreo continuo de seguridad sobre todos sus lotes de producción. Si usted es paciente, médico o farmacéutico y sospecha de una reacción adversa o falla técnica asociada a este medicamento, realice su notificación inmediata a través de nuestro canal digital oficial en: <strong>boozlab.com/farmacovigilancia</strong> o comuníquese a nuestra Dirección Técnica al <strong>+{{ $salesPhone }}</strong>.
        </div>

        <!-- Firmas Oficiales -->
        <div class="signatures">
            <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-title">Director Técnico / Regente Farmacéutico</div>
                <div class="sig-sub">Booz Laboratorio VGME, C.A. • Matrícula M.P.P.S.</div>
            </div>
            <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-title">Garantía de Calidad y Asuntos Regulatorios</div>
                <div class="sig-sub">Conforme a Buenas Prácticas de Manufactura Farmacéutica</div>
            </div>
        </div>

        <!-- Pie Legal -->
        <div class="footer-legal">
            Documento técnico oficial emitido por Booz Laboratorio VGME, C.A. Prohibida su alteración. Para fines de consulta profesional médica y farmacéutica. RIF {{ $companyRif }}.
        </div>
    </div>

    <script>
        // Si se pasa ?print=1 en la URL, abre automáticamente el diálogo de impresión
        if (new URLSearchParams(window.location.search).get('print') === '1') {
            window.addEventListener('load', () => {
                setTimeout(() => window.print(), 350);
            });
        }
    </script>
</body>
</html>
