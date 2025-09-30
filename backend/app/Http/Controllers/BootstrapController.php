<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Task;
use App\Http\Resources\UserResource;
use App\Http\Resources\TaskResource;

class BootstrapController extends Controller
{
  public function index()
  {

    $tasks = Task::orderBy('created_at', 'asc')->get();
    $users = User::select('id', 'name', 'email', 'role')->get();

    return response()->json([
      'users'       => UserResource::collection($users),
      'tasks'       => TaskResource::collection($tasks),
    ]);
  }
}
