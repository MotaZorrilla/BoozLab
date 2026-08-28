<?php

namespace App\Mail;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewMessageLeadAlert extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Message $leadMessage
    ) {}

    public function envelope(): Envelope
    {
        $origin = ($this->leadMessage->source === 'lira_chatbot' || $this->leadMessage->type === 'lira')
            ? '🐾 Lira AI Lead'
            : '🌐 Web Contacto';

        $subject = $this->leadMessage->subject ?: 'Consulta General';

        return new Envelope(
            subject: "[{$origin}] {$this->leadMessage->name} - {$subject}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.message-lead-alert',
        );
    }
}
