<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'            => ['sometimes', 'string', 'max:255'],
            'description'      => ['sometimes', 'nullable', 'string'],
            'dueDay'           => ['sometimes', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'priority'         => ['sometimes', 'in:low,medium,high'],
            'status'           => ['sometimes', 'in:todo,doing,done'],
            'assignedToUserId' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
        ];
    }

    public function validated($key = null, $default = null)
    {
        $v = parent::validated();
        $out = [];
        if (array_key_exists('title', $v))            $out['title'] = $v['title'];
        if (array_key_exists('description', $v))      $out['description'] = $v['description'];
        if (array_key_exists('dueDay', $v))           $out['due_day'] = $v['dueDay'];
        if (array_key_exists('priority', $v))         $out['priority'] = $v['priority'];
        if (array_key_exists('status', $v))           $out['status'] = $v['status'];
        if (array_key_exists('assignedToUserId', $v)) $out['assigned_to_user_id'] = $v['assignedToUserId'];
        return $out;
    }
}
