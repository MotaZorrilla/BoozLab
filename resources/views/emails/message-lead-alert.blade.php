<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nuevo Mensaje Recibido</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
        <tr>
            <td style="background-color: #002072; padding: 20px 30px; text-align: left;">
                <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 800;">BOOZ LABORATORIO</h2>
                <p style="color: #bfdbfe; margin: 4px 0 0 0; font-size: 12px;">Nuevo Mensaje de Contacto / Lead Capturado</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
                    <span style="font-size: 11px; color: #1e40af; font-weight: 700; text-transform: uppercase;">Canal de Origen:</span>
                    <strong style="font-size: 15px; color: #002072; display: block;">
                        {{ ($leadMessage->source === 'lira_chatbot' || $leadMessage->type === 'lira') ? '🐾 Asistente Virtual Lira' : '🌐 Formulario Web' }}
                    </strong>
                </div>

                <table width="100%" style="font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
                    <tr>
                        <td style="color: #64748b; font-weight: 700; width: 35%;">Remitente:</td>
                        <td style="color: #0f172a; font-weight: 700;">{{ $leadMessage->name }}</td>
                    </tr>
                    <tr>
                        <td style="color: #64748b; font-weight: 700;">Correo:</td>
                        <td><a href="mailto:{{ $leadMessage->email }}" style="color: #0284c7;">{{ $leadMessage->email }}</a></td>
                    </tr>
                    @if($leadMessage->phone)
                    <tr>
                        <td style="color: #64748b; font-weight: 700;">Teléfono:</td>
                        <td>
                            <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $leadMessage->phone) }}" style="color: #16a34a; font-weight: 700;">
                                {{ $leadMessage->phone }} (WhatsApp)
                            </a>
                        </td>
                    </tr>
                    @endif
                    @if($leadMessage->subject)
                    <tr>
                        <td style="color: #64748b; font-weight: 700;">Asunto:</td>
                        <td>{{ $leadMessage->subject }}</td>
                    </tr>
                    @endif
                </table>

                <div style="margin-bottom: 25px;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">Mensaje / Consulta:</span>
                    <div style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; color: #334155; margin-top: 5px;">
                        {{ $leadMessage->message }}
                    </div>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="{{ url('/dashboard') }}" style="background-color: #002072; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 700; display: inline-block;">
                        Ver en Bandeja del Dashboard
                    </a>
                </div>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8fafc; padding: 15px 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                Booz Laboratorio VGME, C.A. • Gestión de Atención al Cliente y Leads
            </td>
        </tr>
    </table>
</body>
</html>
