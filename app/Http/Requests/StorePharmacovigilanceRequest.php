<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePharmacovigilanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['nullable', 'exists:products,id'],
            'product_name' => ['required', 'string', 'max:150'],
            'batch_number' => ['nullable', 'string', 'max:50'],
            'expiry_date' => ['nullable', 'date'],
            'reporter_name' => ['required', 'string', 'max:120'],
            'reporter_type' => ['required', 'in:Paciente,Médico,Farmacéutico,Distribuidor'],
            'reporter_contact' => ['required', 'string', 'max:150'],
            'adverse_reaction' => ['required', 'string', 'min:10', 'max:5000'],
            'severity' => ['required', 'in:Leve,Moderada,Grave'],
        ];
    }

    public function messages(): array
    {
        return [
            'adverse_reaction.min' => 'La descripción de la reacción adversa debe tener al menos 10 caracteres.',
            'adverse_reaction.max' => 'La descripción de la reacción no puede superar los 5000 caracteres.',
        ];
    }
}
