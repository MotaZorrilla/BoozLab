<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AskChatbotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'message' => ['nullable', 'string', 'max:1000'],
            'session_uid' => ['nullable', 'string', 'max:64'],
            'url_ref' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'message.max' => 'La consulta no puede exceder los 1000 caracteres.',
        ];
    }
}
