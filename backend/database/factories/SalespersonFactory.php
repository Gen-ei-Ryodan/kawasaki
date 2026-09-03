<?php

namespace Database\Factories;

use App\Models\Salesperson;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Salesperson>
 */
class SalespersonFactory extends Factory
{
    public function definition(): array
    {
        return [
            'employee_code' => 'SP' . str_pad((string)fake()->unique()->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'join_date' => fake()->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
            'status' => 'ACTIVE',
        ];
    }
}