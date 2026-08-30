import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export function useWhatsApp() {
    const { props } = usePage();
    const settings = (props as any).settings || {};

    const salesPhone = settings.whatsapp_sales_phone || '584148873615';
    const contactPhone = settings.whatsapp_contact_phone || salesPhone;
    const companyPhone = settings.company_phone || contactPhone;

    const defaultMessage = settings.whatsapp_default_message || 'Hola Booz Laboratorio, deseo realizar una consulta.';
    const cartHeader = settings.whatsapp_cart_header || '*HOLA BOOZ LABORATORIO* 🔬\nDeseo solicitar cotización y disponibilidad para el siguiente pedido:';
    const cartFooter = settings.whatsapp_cart_footer || '_Por favor confirmar disponibilidad en planta / droguería y tiempos de entrega oficial._';
    const rawCustomerTypes = settings.whatsapp_cart_customer_types || 'Paciente,Farmacia,Clínica,Distribuidor';

    // Clean phone formats: digits only
    const cleanSalesPhone = useMemo(() => salesPhone.replace(/\D/g, ''), [salesPhone]);
    const cleanContactPhone = useMemo(() => contactPhone.replace(/\D/g, ''), [contactPhone]);
    const cleanCompanyPhone = useMemo(() => companyPhone.replace(/\D/g, ''), [companyPhone]);

    const customerTypes = useMemo(() => {
        return rawCustomerTypes.split(',').map((s: string) => s.trim()).filter(Boolean);
    }, [rawCustomerTypes]);

    const createWhatsAppUrl = (customText?: string, targetPhoneOrChannel?: 'contact' | 'sales' | string) => {
        const message = customText || defaultMessage;
        let phoneToUse = cleanContactPhone;

        if (targetPhoneOrChannel === 'sales') {
            phoneToUse = cleanSalesPhone;
        } else if (targetPhoneOrChannel === 'contact') {
            phoneToUse = cleanContactPhone;
        } else if (targetPhoneOrChannel) {
            phoneToUse = targetPhoneOrChannel.replace(/\D/g, '');
        }

        return `https://wa.me/${phoneToUse}?text=${encodeURIComponent(message)}`;
    };

    return {
        phone: contactPhone,
        cleanPhone: cleanContactPhone,
        salesPhone,
        cleanSalesPhone,
        contactPhone,
        cleanContactPhone,
        companyPhone,
        cleanCompanyPhone,
        defaultMessage,
        cartHeader,
        cartFooter,
        customerTypes,
        createWhatsAppUrl,
    };
}
