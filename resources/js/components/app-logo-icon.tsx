import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            src="/assets/img/booz_symbol_icon.png"
            alt="Booz Laboratorio"
            className="h-full w-full object-contain"
            {...props}
        />
    );
}
