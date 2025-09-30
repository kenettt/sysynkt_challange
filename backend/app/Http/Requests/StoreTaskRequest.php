<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'            => ['required', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'dueDay'           => ['required', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'priority'         => ['required', 'in:low,medium,high'],
            'status'           => ['required', 'in:todo,doing,done'],
            'assignedToUserId' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }

    public function validated($key = null, $default = null)
    {
        $v = parent::validated();
        return [
            'title'               => $v['title'],
            'description'         => $v['description'] ?? null,
            'due_day'             => $v['dueDay'],
            'priority'            => $v['priority'],
            'status'              => $v['status'],
            'assigned_to_user_id' => $v['assignedToUserId'] ?? null,
        ];
    }
}
