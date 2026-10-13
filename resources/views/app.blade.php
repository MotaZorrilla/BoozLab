<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Open Graph / WhatsApp Preview (1200x630 Anti-Caché) -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://lab.motazorrilla.com/booz/">
        <meta property="og:title" content="Laboratorio Booz C.A. · Innovación Farmacéutica y Cosmecéutica">
        <meta property="og:description" content="Soluciones dermatológicas avanzadas, catálogo técnico oficial, asistente farmacéutico Lira y canal B2B.">
        <meta property="og:image" content="https://lab.motazorrilla.com/booz/assets/img/booz_og_preview.jpg?v=2.0">
        <meta property="og:image:secure_url" content="https://lab.motazorrilla.com/booz/assets/img/booz_og_preview.jpg?v=2.0">
        <meta property="og:image:type" content="image/jpeg">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:locale" content="es_VE">
        <meta property="og:site_name" content="Laboratorio Booz C.A.">

        <!-- Twitter Card Fallback -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Laboratorio Booz C.A. · Innovación Farmacéutica y Cosmecéutica">
        <meta name="twitter:description" content="Soluciones dermatológicas avanzadas, catálogo técnico oficial, asistente farmacéutico Lira y canal B2B.">
        <meta name="twitter:image" content="https://lab.motazorrilla.com/booz/assets/img/booz_og_preview.jpg?v=2.0">

        {{-- Inline script to detect stored theme or default to light without flash --}}
        <script>
            (function() {
                try {
                    const stored = localStorage.getItem('appearance') || localStorage.getItem('booz_theme');
                    if (stored === 'dark') {
                        document.documentElement.classList.add('dark');
                        document.documentElement.style.colorScheme = 'dark';
                    } else {
                        document.documentElement.classList.remove('dark');
                        document.documentElement.style.colorScheme = 'light';
                    }
                } catch (e) {}
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
