<?php

namespace Database\Factories;

use App\Models\Reward;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Reward>
 */
class RewardFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => 'REW' . str_pad((string)fake()->unique()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'points_required' => fake()->numberBetween(200, 2000),
            'stock' => fake()->numberBetween(10, 100),
            'status' => 'ACTIVE',
        ];
    }
}