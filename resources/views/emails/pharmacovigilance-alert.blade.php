<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Alerta de Farmacovigilancia</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
        <tr>
            <td style="background-color: #002072; padding: 20px 30px; text-align: left;">
                <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.5px;">BOOZ LABORATORIO</h2>
                <p style="color: #bfdbfe; margin: 4px 0 0 0; font-size: 12px;">Alerta de Farmacovigilancia y Control Sanitario INH</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
                    <span style="font-size: 11px; color: #1e40af; font-weight: 700; text-transform: uppercase;">Ticket Asignado:</span>
                    <strong style="font-size: 16px; color: #002072; display: block; font-family: monospace;">{{ $report->ticket_number }}</strong>
                </div>

                <table width="100%" style="font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
                    <tr>
                        <td style="color: #64748b; font-weight: 700; width: 40%;">Producto:</td>
                        <td style="color: #0f172a; font-weight: 700;">{{ $report->product_name }}</td>
                    </tr>
                    <tr>
                        <td style="color: #64748b; font-weight: 700;">Lote:</td>
                        <td>{{ $report->batch_number ?: 'No indicado' }}</td>
                    </tr>
                    <tr>
                        <td style="color: #64748b; font-weight: 700;">Severidad:</td>
                        <td>
                            <strong style="color: {{ $report->severity === 'Grave' ? '#b91c1c' : ($report->severity === 'Moderada' ? '#b45309' : '#15803d') }};">
                                {{ $report->severity }}
                            </strong>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #64748b; font-weight: 700;">Reportante:</td>
                        <td>{{ $report->reporter_name }} ({{ $report->reporter_type }})</td>
                    </tr>
                    <tr>
                        <td style="color: #64748b; font-weight: 700;">Contacto:</td>
                        <td>{{ $report->reporter_contact }}</td>
                    </tr>
                </table>

                <div style="margin-bottom: 25px;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">Descripción de la Reacción Adversa:</span>
                    <div style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; color: #334155; margin-top: 5px;">
                        {{ $report->adverse_reaction }}
                    </div>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="{{ url('/dashboard') }}" style="background-color: #002072; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 700; display: inline-block;">
                        Gestionar en Consola Administrativa
                    </a>
                </div>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8fafc; padding: 15px 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                Booz Laboratorio VGME, C.A. • Sistema Automatizado de Farmacovigilancia Sanitaria
            </td>
        </tr>
    </table>
</body>
</html>
