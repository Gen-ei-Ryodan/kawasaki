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
            'customer_id' => null,
            'tier_id' => null,
            'status' => 'ACTIVE',
        ];
    }
}