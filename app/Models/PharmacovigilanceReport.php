<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PharmacovigilanceReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'product_id',
        'product_name',
        'batch_number',
        'expiry_date',
        'reporter_name',
        'reporter_type',
        'reporter_contact',
        'adverse_reaction',
        'severity',
        'status',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'expiry_date' => 'date',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Generate correlative ticket number BOOZ-FV-YYYY-XXXX.
     *
     * The next correlative is derived from the last persisted ticket of the
     * current year under a pessimistic row lock, so concurrent reports cannot
     * collide even if older records are deleted.
     */
    public static function generateTicketNumber(): string
    {
        $year = date('Y');

        $last = static::query()
            ->lockForUpdate()
            ->whereYear('created_at', $year)
            ->orderByDesc('ticket_number')
            ->value('ticket_number');

        $next = $last ? ((int) substr($last, strrpos($last, '-') + 1)) + 1 : 1;

        return sprintf('BOOZ-FV-%s-%04d', $year, $next);
    }
}
