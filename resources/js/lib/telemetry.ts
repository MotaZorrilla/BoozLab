/**
 * Track client-side interaction events in a non-blocking, reliable way.
 * Uses navigator.sendBeacon where available, falling back to fetch with keepalive.
 */
export function trackInteractionEvent(
    eventType: string,
    channel: 'whatsapp' | 'lira_ai' | 'web_form' | 'store_cart' = 'whatsapp',
    source: string = 'web',
    productId?: number | null,
    metadata: Record<string, any> = {}
) {
    if (typeof window === 'undefined') return;

    try {
        let sessionUid = null;
        try {
            sessionUid = sessionStorage.getItem('booz_lira_session_uid');
        } catch {}

        const payload = JSON.stringify({
            event_type: eventType,
            channel,
            source,
            product_id: productId || null,
            session_uid: sessionUid,
            metadata: {
                ...metadata,
                url: window.location.pathname,
                referrer: document.referrer || null,
                timestamp: new Date().toISOString(),
            },
        });

        // 1. Priorizar navigator.sendBeacon para ejecución instantánea sin retrasos
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            const blob = new Blob([payload], { type: 'application/json' });
            const success = navigator.sendBeacon('/api/telemetry/event', blob);
            if (success) return;
        }

        // 2. Respaldo transparente con fetch keepalive
        fetch('/api/telemetry/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: payload,
            keepalive: true,
        }).catch(() => {});
    } catch (err) {
        // La telemetría jamás interrumpe la navegación del usuario
        console.warn('Telemetry event warning:', err);
    }
}
