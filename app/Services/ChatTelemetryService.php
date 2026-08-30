<?php

namespace App\Services;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatTelemetryService
{
    /**
     * Record a chat interaction turn in a fail-safe, non-blocking manner.
     *
     * @param string $sessionUid Unique identifier of the client conversation session.
     * @param string $userQuery Query sent by the user.
     * @param array $result Result payload returned by LiraAiService.
     * @param string|null $urlRef Origin page URL pathname.
     * @param Request|null $request Current HTTP request for anonymous peer hash.
     * @return ChatSession|null
     */
    public function recordTurn(
        string $sessionUid,
        string $userQuery,
        array $result,
        ?string $urlRef = null,
        ?Request $request = null
    ): ?ChatSession {
        try {
            $now = now();
            $latency = (int) ($result['latency_ms'] ?? 0);
            $source = $result['source'] ?? 'unknown';

            // 1. Resolver o instanciar la sesión
            $session = ChatSession::firstOrNew(['session_uid' => $sessionUid]);

            if (! $session->exists) {
                $session->session_uid = $sessionUid;
                $session->first_query = mb_substr($userQuery, 0, 250);
                $session->url_ref = $urlRef ?: ($request ? $request->header('referer') : '/');

                if ($request) {
                    $ip = $request->ip() ?: '127.0.0.1';
                    $ua = $request->userAgent() ?: 'unknown';
                    $session->peer_hash = hash('sha256', $ip . '|' . $ua);
                } else {
                    $session->peer_hash = hash('sha256', 'cli|' . $sessionUid);
                }

                $session->started_at = $now;
                $session->turn_count = 0;
                $session->total_latency_ms = 0;
            }

            // 2. Extraer IDs de productos sugeridos
            $newProductIds = [];
            if (! empty($result['suggestedProducts'])) {
                foreach ($result['suggestedProducts'] as $item) {
                    if (is_object($item) && isset($item->id)) {
                        $newProductIds[] = (int) $item->id;
                    } elseif (is_array($item) && isset($item['id'])) {
                        $newProductIds[] = (int) $item['id'];
                    }
                }
            }

            $existingProductIds = is_array($session->suggested_product_ids) ? $session->suggested_product_ids : [];
            $mergedProductIds = array_values(array_unique(array_merge($existingProductIds, $newProductIds)));

            // 3. Actualizar contadores y estado de sesión
            $session->turn_count = ($session->turn_count ?: 0) + 1;
            $session->total_latency_ms = ($session->total_latency_ms ?: 0) + $latency;
            $session->last_source = $source;
            $session->suggested_product_ids = $mergedProductIds;
            $session->ended_at = $now;

            if (! empty($result['action'])) {
                $session->action = $result['action'];
            }

            $session->save();

            // 4. Crear registro para mensaje del usuario
            ChatMessage::create([
                'chat_session_id' => $session->id,
                'role' => 'user',
                'content' => $userQuery,
                'source' => null,
                'model' => null,
                'latency_ms' => 0,
                'prompt_tokens' => null,
                'completion_tokens' => null,
                'disclaimer_shown' => false,
                'guardrail_triggered' => null,
                'created_at' => $now,
            ]);

            // 5. Crear registro para respuesta de Lira
            ChatMessage::create([
                'chat_session_id' => $session->id,
                'role' => 'assistant',
                'content' => $result['reply'] ?? '',
                'source' => $source,
                'model' => $result['model'] ?? null,
                'latency_ms' => $latency,
                'prompt_tokens' => $result['prompt_tokens'] ?? null,
                'completion_tokens' => $result['completion_tokens'] ?? null,
                'disclaimer_shown' => ! empty($result['disclaimer']),
                'guardrail_triggered' => $result['guardrail_triggered'] ?? null,
                'created_at' => $now->copy()->addMillisecond(),
            ]);

            return $session;
        } catch (\Throwable $e) {
            Log::warning('ChatTelemetryService: Excepción silenciosa capturada en telemetría: ' . $e->getMessage(), [
                'session_uid' => $sessionUid,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return null;
        }
    }

    /**
     * Mark a session as converted to a commercial order.
     */
    public function markAsConverted(string $sessionUid): bool
    {
        try {
            $session = ChatSession::where('session_uid', $sessionUid)->first();
            if ($session) {
                $session->update(['converted_to_order' => true]);
                return true;
            }
        } catch (\Throwable $e) {
            Log::warning('ChatTelemetryService: Error marcando sesión como convertida: ' . $e->getMessage());
        }

        return false;
    }

    /**
     * Record an interaction event (e.g. WhatsApp click, quote, web form) in a fail-safe manner.
     */
    public function recordInteraction(
        string $eventType,
        string $channel,
        string $source,
        ?int $productId = null,
        ?string $sessionUid = null,
        array $metadata = []
    ): ?\App\Models\InteractionEvent {
        try {
            $event = \App\Models\InteractionEvent::create([
                'event_type' => $eventType,
                'channel' => $channel,
                'source' => $source,
                'product_id' => $productId,
                'session_uid' => $sessionUid,
                'metadata' => $metadata,
            ]);

            // Si es un clic de WhatsApp para un producto, incrementar contador diario en product_daily_stats
            if ($productId && $eventType === 'whatsapp_click') {
                $todayStr = now()->toDateString();
                $stat = \App\Models\ProductDailyStat::firstOrNew([
                    'product_id' => $productId,
                    'date' => $todayStr,
                ]);
                $stat->whatsapp_clicks_count = ($stat->whatsapp_clicks_count ?: 0) + 1;
                $stat->save();
            }

            return $event;
        } catch (\Throwable $e) {
            Log::warning('ChatTelemetryService: Excepción registrando evento de interacción: ' . $e->getMessage(), [
                'event_type' => $eventType,
                'channel' => $channel,
            ]);

            return null;
        }
    }
}
