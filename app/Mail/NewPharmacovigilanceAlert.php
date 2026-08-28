<?php

namespace App\Mail;

use App\Models\PharmacovigilanceReport;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewPharmacovigilanceAlert extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public PharmacovigilanceReport $report
    ) {}

    public function envelope(): Envelope
    {
        $prefix = $this->report->severity === 'Grave' ? '🚨 [URGENTE INH]' : '⚠️ [Farmacovigilancia]';

        return new Envelope(
            subject: "{$prefix} Nuevo Reporte #{$this->report->ticket_number} - {$this->report->product_name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.pharmacovigilance-alert',
        );
    }
}
