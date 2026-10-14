<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - Registro No Encontrado | Booz Laboratorio</title>
    <link rel="icon" type="image/x-icon" href="{{ config('app.url') }}/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col items-center justify-center p-4">
    <div class="max-w-md w-full text-center bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-50 text-[#002072] mb-6 border border-blue-100 shadow-inner">
            <span class="text-3xl font-black">404</span>
        </div>
        <div class="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2">
            Booz Laboratorio C.A.
        </div>
        <h1 class="text-xl font-extrabold text-slate-900 mb-3">
            Registro Clínico No Encontrado
        </h1>
        <p class="text-xs leading-relaxed text-slate-500 mb-6">
            La formulación médica, sección o recurso clínico al que intentó acceder no está disponible o ha cambiado de enlace oficial.
        </p>
        <a href="{{ config('app.url') }}/" class="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-[#002072] text-white text-xs font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all">
            Volver al Catálogo Principal
        </a>
    </div>
    <div class="mt-6 text-[11px] text-slate-400">
        Planta Valle de Guanape, Edo. Anzoátegui • Venezuela
    </div>
</body>
</html>
