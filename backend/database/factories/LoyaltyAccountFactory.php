<?php

namespace Database\Factories;

use App\Models\LoyaltyAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LoyaltyAccount>
 */
class LoyaltyAccountFactory extends Factory
{
    public function definition(): array
    {
        return [
            'customer_id' => null, // will be set in seeder
            'tier_id' => null, // will be set in seeder
            'points' => fake()->numberBetween(0, 10000),
            'lifetime_points' => fake()->numberBetween(0, 50000),
        ];
    }
}