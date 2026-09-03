<?php

namespace Database\Factories;

use App\Models\LoyaltyTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LoyaltyTransaction>
 */
class LoyaltyTransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'customer_id' => null,
            'type' => 'EARN',
            'points' => fake()->numberBetween(100, 1000),
            'description' => fake()->sentence(),
        ];
    }
}