<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acta Sanitaria INH - {{ $report->ticket_number }} | Booz Laboratorio</title>
    <style>
        @page {
            size: letter;
            margin: 1.5cm;
        }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #1e293b;
            line-height: 1.5;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #002072;
            padding-bottom: 20px;
            margin-bottom: 25px;
        }
        .logo-area {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .logo-img {
            width: 55px;
            height: 55px;
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
            color: #64748b;
            font-weight: 700;
            margin: 2px 0;
        }
        .company-loc {
            font-size: 10px;
            color: #94a3b8;
            margin: 0;
        }
        .ticket-badge {
            text-align: right;
        }
        .ticket-number {
            font-size: 16px;
            font-family: monospace;
            font-weight: 900;
            color: #002072;
            background: #eff6ff;
            padding: 6px 12px;
            border-radius: 8px;
            border: 1px solid #bfdbfe;
            display: inline-block;
        }
        .ticket-date {
            font-size: 10px;
            color: #64748b;
            margin-top: 4px;
        }
        .doc-title {
            text-align: center;
            font-size: 15px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 25px;
            background: #f1f5f9;
            padding: 8px;
            border-radius: 6px;
        }
        .section-box {
            margin-bottom: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
        }
        .section-header {
            background: #002072;
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 6px 12px;
            letter-spacing: 0.5px;
        }
        .section-body {
            padding: 12px 16px;
            font-size: 12px;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        .grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
        }
        .field-label {
            font-size: 10px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 2px;
        }
        .field-value {
            font-size: 12px;
            font-weight: 600;
            color: #0f172a;
        }
        .severity-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 800;
            font-size: 11px;
        }
        .severity-Grave { background: #fee2e2; color: #991b1b; }
        .severity-Moderada { background: #fef3c7; color: #92400e; }
        .severity-Leve { background: #dcfce7; color: #166534; }
        .reaction-text {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 10px;
            border-radius: 6px;
            font-size: 12px;
            line-height: 1.6;
            margin-top: 4px;
        }
        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            padding-top: 20px;
        }
        .sig-block {
            width: 45%;
            text-align: center;
            border-top: 1px dashed #94a3b8;
            padding-top: 8px;
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
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            font-size: 9px;
            color: #94a3b8;
            text-align: center;
        }
        .action-bar {
            max-width: 800px;
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
            gap: 6px;
            box-shadow: 0 2px 8px rgba(0,32,114,0.25);
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
                border-radius: 0;
            }
            .action-bar {
                display: none !important;
            }
        }
    </style>
</head>
<body>

    <div class="action-bar">
        <a href="/dashboard" class="btn btn-back">← Volver al Dashboard</a>
        <button onclick="window.print()" class="btn">🖨️ Imprimir / Guardar como PDF</button>
    </div>

    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-area">
                <img src="/assets/img/booz_symbol_icon.png" alt="Booz Logo" class="logo-img">
                <div>
                    <h1 class="company-name">BOOZ LABORATORIO</h1>
                    <p class="company-rif">BOOZ LABORATORIO VGME, C.A. • RIF J-40906185-0</p>
                    <p class="company-loc">Planta: Valle de Guanape, Edo. Anzoátegui • Reg. Sanitario INH</p>
                </div>
            </div>
            <div class="ticket-badge">
                <div class="ticket-number">{{ $report->ticket_number }}</div>
                <div class="ticket-date">Fecha: {{ $report->created_at->format('d/m/Y H:i A') }}</div>
            </div>
        </div>

        <div class="doc-title">
            Acta Oficial de Notificación de Farmacovigilancia y Calidad Sanitaria
        </div>

        <!-- Sección 1: Datos del Medicamento -->
        <div class="section-box">
            <div class="section-header">1. Identificación del Producto Farmacéutico</div>
            <div class="section-body">
                <div class="grid-3">
                    <div>
                        <div class="field-label">Nombre Comercial</div>
                        <div class="field-value">{{ $report->product_name }}</div>
                    </div>
                    <div>
                        <div class="field-label">Número de Lote</div>
                        <div class="field-value">{{ $report->batch_number ?: 'No indicado' }}</div>
                    </div>
                    <div>
                        <div class="field-label">Fecha de Vencimiento</div>
                        <div class="field-value">{{ $report->expiry_date ?: 'No indicada' }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sección 2: Notificante y Severidad -->
        <div class="section-box">
            <div class="section-header">2. Datos del Notificante y Clasificación Sanitaria</div>
            <div class="section-body">
                <div class="grid-3">
                    <div>
                        <div class="field-label">Nombre del Reportante</div>
                        <div class="field-value">{{ $report->reporter_name }}</div>
                    </div>
                    <div>
                        <div class="field-label">Tipo de Notificante</div>
                        <div class="field-value">{{ $report->reporter_type }}</div>
                    </div>
                    <div>
                        <div class="field-label">Nivel de Severidad</div>
                        <div class="field-value">
                            <span class="severity-badge severity-{{ $report->severity }}">
                                {{ $report->severity }}
                            </span>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <div class="field-label">Contacto / Teléfono / Correo</div>
                    <div class="field-value">{{ $report->reporter_contact }}</div>
                </div>
            </div>
        </div>

        <!-- Sección 3: Evento Adverso -->
        <div class="section-box">
            <div class="section-header">3. Descripción del Evento Adverso o Falla de Calidad</div>
            <div class="section-body">
                <div class="reaction-text">
                    {{ $report->adverse_reaction }}
                </div>
            </div>
        </div>

        <!-- Sección 4: Dictamen Técnico -->
        <div class="section-box">
            <div class="section-header">4. Dictamen del Departamento de Farmacovigilancia y Garantía de Calidad</div>
            <div class="section-body">
                <div class="grid-2" style="margin-bottom: 8px;">
                    <div>
                        <div class="field-label">Estado Sanitario del Caso</div>
                        <div class="field-value" style="font-weight: 800; color: #002072;">{{ $report->status }}</div>
                    </div>
                    <div>
                        <div class="field-label">Fecha de Actualización Técnica</div>
                        <div class="field-value">{{ $report->updated_at->format('d/m/Y H:i A') }}</div>
                    </div>
                </div>
                <div>
                    <div class="field-label">Acciones Correctivas y Dictamen Administrativo</div>
                    <div class="reaction-text">
                        {{ $report->admin_notes ?: 'Caso en proceso de evaluación y trazabilidad con contramuestra de lote.' }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Firmas Legales -->
        <div class="signatures">
            <div class="sig-block">
                <div class="sig-title">Director Técnico / Regente Farmacéutico</div>
                <div class="sig-sub">Booz Laboratorio VGME, C.A. • Matrícula M.P.P.S.</div>
            </div>
            <div class="sig-block">
                <div class="sig-title">Recepción y Control Sanitario INH</div>
                <div class="sig-sub">Sello y Firma de Constancia Oficial</div>
            </div>
        </div>

        <div class="footer-legal">
            Documento emitido conforme a las Normas de Buenas Prácticas de Farmacovigilancia del Instituto Nacional de Higiene "Rafael Rangel" (INH). Booz Laboratorio VGME, C.A.
        </div>
    </div>

</body>
</html>
