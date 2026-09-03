<?php

namespace Database\Factories;

use App\Models\LoyaltyTier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LoyaltyTier>
 */
class LoyaltyTierFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'minimum_points' => fake()->numberBetween(0, 20000),
            'benefits' => fake()->sentence(),
            'status' => 'ACTIVE',
        ];
    }
}