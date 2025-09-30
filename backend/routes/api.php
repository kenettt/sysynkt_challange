<?php

use App\Http\Controllers\BootstrapController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/bootstrap', [BootstrapController::class, 'index']);

Route::post('/tasks', [TaskController::class, 'store']);

Route::patch('/tasks/{task}', [TaskController::class, 'update']);

Route::patch('/tasks/{task}/status',   [TaskController::class, 'updateStatus']);

Route::patch('/tasks/{task}/assignee', [TaskController::class, 'updateAssignee']);

Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
