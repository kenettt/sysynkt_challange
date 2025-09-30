<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();

        $data['status'] = $data['status'] ?? 'todo';

        $task = Task::create($data);

        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->fill($request->validated())->save();
        return new TaskResource($task);
    }

    public function updateStatus(Request $request, Task $task)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:todo,doing,done'],
        ]);
        $task->update($validated);
        return new TaskResource($task);
    }

    public function updateAssignee(Request $request, Task $task)
    {
        $validated = $request->validate([
            'assignedToUserId' => ['nullable', 'integer', 'exists:users,id'],
        ]);
        $task->update([
            'assigned_to_user_id' => $validated['assignedToUserId'] ?? null,
        ]);
        return new TaskResource($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->noContent();
    }
}
