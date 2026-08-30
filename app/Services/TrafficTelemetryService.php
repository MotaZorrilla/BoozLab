<?php

namespace App\Services;

use App\Models\DailyVisitor;
use App\Models\PageView;
use App\Models\Product;
use App\Models\ProductDailyStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TrafficTelemetryService
{
    /**
     * Record a public pageview delivery in a fail-safe, non-blocking way.
     */
    public function recordPageView(Request $request): void
    {
        try {
            // 1. Validar métodos HTTP (solo GET y HEAD son entregas de páginas al navegador)
            if (! in_array($request->method(), ['GET', 'HEAD'])) {
                return;
            }

            // 2. Excluir rutas internas, de administración, API y depuración
            $path = '/' . ltrim($request->path(), '/');

            if ($this->shouldIgnorePath($path)) {
                return;
            }

            // 3. Excluir peticiones a recursos estáticos que puedan haber pasado
            if (preg_match('/\.(js|css|map|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|json|xml|txt)$/i', $path)) {
                return;
            }

            $date = now()->toDateString();
            $ip = $request->ip() ?: '127.0.0.1';
            $ua = $request->userAgent() ?: 'unknown';
            $visitorHash = hash('sha256', $ip . '|' . $ua . '|' . $date);

            // 4. Clasificar sección del sitio y resolver producto si aplica
            [$section, $productId] = $this->classifySectionAndProduct($path);

            // 5. Analizar User-Agent de forma ultra-rápida (Zero-Latency)
            [$browser, $deviceType, $os] = $this->parseUserAgent($ua);

            // 6. Determinar si es un visitante nuevo hoy
            $isNewVisitorToday = false;
            try {
                $visitor = DailyVisitor::firstOrCreate(
                    [
                        'date' => $date,
                        'visitor_hash' => $visitorHash,
                    ],
                    [
                        'browser' => $browser,
                        'device_type' => $deviceType,
                        'os' => $os,
                        'entry_path' => $path,
                        'created_at' => now(),
                    ]
                );
                $isNewVisitorToday = $visitor->wasRecentlyCreated;
            } catch (\Throwable $e) {
                // Posible colisión concurrente menor
                $isNewVisitorToday = false;
            }

            // 6. Actualizar o crear registro en page_views
            $pageView = PageView::firstOrNew([
                'date' => $date,
                'url_path' => $path,
            ]);

            if (! $pageView->exists) {
                $pageView->section = $section;
                $pageView->product_id = $productId;
                $pageView->views_count = 1;
                $pageView->unique_visitors_count = 1;
            } else {
                $pageView->views_count = ($pageView->views_count ?: 0) + 1;
                if ($isNewVisitorToday) {
                    $pageView->unique_visitors_count = ($pageView->unique_visitors_count ?: 0) + 1;
                }
                if ($productId && ! $pageView->product_id) {
                    $pageView->product_id = $productId;
                }
            }
            $pageView->save();

            // 7. Si es una ficha de producto o vademécum, actualizar contador diario en product_daily_stats
            if ($productId && in_array($section, ['product', 'vademecum'])) {
                $stat = ProductDailyStat::firstOrNew([
                    'product_id' => $productId,
                    'date' => $date,
                ]);
                $stat->views_count = ($stat->views_count ?: 0) + 1;
                $stat->save();
            }
        } catch (\Throwable $e) {
            Log::warning('TrafficTelemetryService: Error registrando visita de página: ' . $e->getMessage(), [
                'path' => $request->path(),
            ]);
        }
    }

    /**
     * Determine if path should be ignored from traffic metrics.
     */
    protected function shouldIgnorePath(string $path): bool
    {
        $ignoredPrefixes = [
            '/admin',
            '/api',
            '/_boost',
            '/build',
            '/assets',
            '/storage',
            '/telescope',
            '/up',
            '/sanctum',
            '/livewire',
        ];

        foreach ($ignoredPrefixes as $prefix) {
            if ($path === $prefix || str_starts_with($path, $prefix . '/')) {
                return true;
            }
        }

        return false;
    }

    /**
     * Classify section and resolve product ID if applicable.
     */
    protected function classifySectionAndProduct(string $path): array
    {
        if ($path === '/' || $path === '') {
            return ['home', null];
        }

        if (preg_match('#^/producto/([^/]+)/vademecum$#', $path, $matches)) {
            $slug = $matches[1];
            $product = Product::where('slug', $slug)->first();
            return ['vademecum', $product?->id];
        }

        if (preg_match('#^/producto/([^/]+)$#', $path, $matches)) {
            $slug = $matches[1];
            $product = Product::where('slug', $slug)->first();
            return ['product', $product?->id];
        }

        if (str_starts_with($path, '/farmacovigilancia')) {
            return ['farmacovigilancia', null];
        }

        if (str_starts_with($path, '/herramientas')) {
            return ['tools', null];
        }

        if (str_starts_with($path, '/glosario')) {
            return ['glossary', null];
        }

        if (str_starts_with($path, '/casos-clinicos')) {
            return ['cases', null];
        }

        if (str_starts_with($path, '/blog')) {
            return ['blog', null];
        }

        return ['other', null];
    }

    /**
     * Parse User-Agent ultra-fast with lightweight regex (Zero external dependencies).
     */
    protected function parseUserAgent(string $ua): array
    {
        $browser = 'Otro';
        $deviceType = 'Desktop';
        $os = 'Otro';

        // 1. Detección de Dispositivo
        if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $ua)) {
            $deviceType = 'Tablet';
        } elseif (preg_match('/(mobile|ipod|iphone|blackberry|opera mini|opera mobi|windows phone)/i', $ua)) {
            $deviceType = 'Mobile';
        }

        // 2. Detección de Navegador
        if (preg_match('/Edg[e]?\/([0-9.]+)/i', $ua)) {
            $browser = 'Edge';
        } elseif (preg_match('/OPR\/([0-9.]+)|Opera/i', $ua)) {
            $browser = 'Opera';
        } elseif (preg_match('/Chrome\/([0-9.]+)/i', $ua) && ! preg_match('/Edg|OPR/i', $ua)) {
            $browser = 'Chrome';
        } elseif (preg_match('/Firefox\/([0-9.]+)/i', $ua)) {
            $browser = 'Firefox';
        } elseif (preg_match('/Safari\/([0-9.]+)/i', $ua) && ! preg_match('/Chrome/i', $ua)) {
            $browser = 'Safari';
        } elseif (preg_match('/MSIE|Trident/i', $ua)) {
            $browser = 'IE';
        }

        // 3. Detección de SO
        if (preg_match('/windows nt/i', $ua)) {
            $os = 'Windows';
        } elseif (preg_match('/macintosh|mac os x/i', $ua)) {
            $os = 'macOS';
        } elseif (preg_match('/android/i', $ua)) {
            $os = 'Android';
        } elseif (preg_match('/iphone|ipad|ipod/i', $ua)) {
            $os = 'iOS';
        } elseif (preg_match('/linux/i', $ua)) {
            $os = 'Linux';
        }

        return [$browser, $deviceType, $os];
    }
}
