<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                => $this->id,
            'title'             => $this->title,
            'description'       => $this->description,
            'dueDay'            => $this->due_day,
            'priority'          => $this->priority,
            'status'            => $this->status,
            'assignedToUserId'  => $this->assigned_to_user_id ? (int)$this->assigned_to_user_id : null,
        ];
    }
}
