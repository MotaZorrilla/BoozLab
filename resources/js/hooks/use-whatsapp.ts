import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export function useWhatsApp() {
    const { props } = usePage();
    const settings = (props as any).settings || {};

    const rawPhone = settings.whatsapp_sales_phone || '584148873615';
    const defaultMessage = settings.whatsapp_default_message || 'Hola Booz Laboratorio, deseo realizar una consulta.';
    const cartHeader = settings.whatsapp_cart_header || '*HOLA BOOZ LABORATORIO* 🔬\nDeseo solicitar cotización y disponibilidad para el siguiente pedido:';
    const cartFooter = settings.whatsapp_cart_footer || '_Por favor confirmar disponibilidad en planta / droguería y tiempos de entrega oficial._';
    const rawCustomerTypes = settings.whatsapp_cart_customer_types || 'Paciente,Farmacia,Clínica,Distribuidor';

    // Clean phone format: digits only
    const cleanPhone = useMemo(() => {
        return rawPhone.replace(/\D/g, '');
    }, [rawPhone]);

    const customerTypes = useMemo(() => {
        return rawCustomerTypes.split(',').map((s: string) => s.trim()).filter(Boolean);
    }, [rawCustomerTypes]);

    const createWhatsAppUrl = (customText?: string, targetPhone?: string) => {
        const message = customText || defaultMessage;
        const phoneToUse = targetPhone ? targetPhone.replace(/\D/g, '') : cleanPhone;
        return `https://wa.me/${phoneToUse}?text=${encodeURIComponent(message)}`;
    };

    return {
        phone: rawPhone,
        cleanPhone,
        defaultMessage,
        cartHeader,
        cartFooter,
        customerTypes,
        createWhatsAppUrl,
    };
}
