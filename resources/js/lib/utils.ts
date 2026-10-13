import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function appUrl(path: string): string {
    if (!path) return '';
    if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('mailto:') ||
        path.startsWith('tel:') ||
        path.startsWith('//') ||
        path.startsWith('#')
    ) {
        return path;
    }
    if (typeof window !== 'undefined') {
        const isBoozSubpath = window.location.pathname.startsWith('/booz');
        if (isBoozSubpath) {
            const cleanPath = path.startsWith('/') ? path : `/${path}`;
            if (!cleanPath.startsWith('/booz')) {
                return `/booz${cleanPath}`;
            }
        }
    }
    return path;
}
