<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{

    public function run(): void
    {
        \App\Models\User::truncate();

        \App\Models\User::insert([
            [
                'name'   => 'Mom',
                'email'  => 'mom@example.com',
                'role'   => 'mom',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'   => 'Dad',
                'email'  => 'dad@example.com',
                'role'   => 'dad',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'   => 'Alex',
                'email'  => 'alex@example.com',
                'role'   => 'child_male',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'   => 'Sam',
                'email'  => 'sam@example.com',
                'role'   => 'child_female',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
