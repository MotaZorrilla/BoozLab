import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export function useWhatsApp() {
    const { props } = usePage();
    const settings = (props as any).settings || {};

    const rawPhone = settings.whatsapp_sales_phone || '584148873615';
    const defaultMessage = settings.whatsapp_default_message || 'Hola Booz Laboratorio, deseo realizar una consulta.';

    // Clean phone format: digits only
    const cleanPhone = useMemo(() => {
        return rawPhone.replace(/\D/g, '');
    }, [rawPhone]);

    const createWhatsAppUrl = (customText?: string) => {
        const message = customText || defaultMessage;
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    };

    return {
        phone: rawPhone,
        cleanPhone,
        defaultMessage,
        createWhatsAppUrl,
    };
}
