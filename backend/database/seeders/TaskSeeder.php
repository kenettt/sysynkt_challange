<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TaskSeeder extends Seeder
{
    public function run(): void
    {


        $idsByRole = User::query()->pluck('id', 'role');

        $tasks = [
            [
                'title' => 'Grocery Shopping',
                'description' => 'Get groceries for the week',
                'due_day' => 'monday',
                'priority' => 'high',
                'status' => 'todo',
                'assigned_to_user_id' => $idsByRole['mom'] ?? null,
                'created_at' => Carbon::parse('2024-01-15'),
            ],
            [
                'title' => 'Take Out Trash',
                'description' => 'Empty all trash bins and take to curb',
                'due_day' => 'tuesday',
                'priority' => 'medium',
                'status' => 'todo',
                'assigned_to_user_id' => null, // avatud ülesanne
                'created_at' => Carbon::parse('2024-01-15'),
            ],
            [
                'title' => 'Soccer Practice',
                'description' => 'Drop off Alex at soccer practice',
                'due_day' => 'wednesday',
                'priority' => 'high',
                'status' => 'todo',
                'assigned_to_user_id' => $idsByRole['dad'] ?? null,
                'created_at' => Carbon::parse('2024-01-15'),
            ],
            [
                'title' => 'Vacuum Living Room',
                'description' => 'Vacuum the main living areas',
                'due_day' => 'thursday',
                'priority' => 'low',
                'status' => 'done',
                'assigned_to_user_id' => $idsByRole['child_female'] ?? null,
                'created_at' => Carbon::parse('2024-01-14'),
            ],
            [
                'title' => 'Laundry',
                'description' => 'Wash, dry, and fold clothes',
                'due_day' => 'friday',
                'priority' => 'medium',
                'status' => 'doing',
                'assigned_to_user_id' => $idsByRole['mom'] ?? null,
                'created_at' => Carbon::parse('2024-01-15'),
            ],
            [
                'title' => 'Water Plants',
                'description' => 'Water all indoor and outdoor plants',
                'due_day' => 'saturday',
                'priority' => 'low',
                'status' => 'todo',
                'assigned_to_user_id' => null,
                'created_at' => Carbon::parse('2024-01-15'),
            ],
            [
                'title' => 'Family Game Night',
                'description' => 'Set up games and snacks for family time',
                'due_day' => 'sunday',
                'priority' => 'medium',
                'status' => 'todo',
                'assigned_to_user_id' => $idsByRole['child_male'] ?? null,
                'created_at' => Carbon::parse('2024-01-15'),
            ],
            [
                'title' => 'Clean Kitchen',
                'description' => 'Deep clean counters, appliances, and floor',
                'due_day' => 'monday',
                'priority' => 'medium',
                'status' => 'todo',
                'assigned_to_user_id' => null,
                'created_at' => Carbon::parse('2024-01-15'),
            ],
        ];

        foreach ($tasks as $task) {
            Task::create($task);
        }
    }
}
