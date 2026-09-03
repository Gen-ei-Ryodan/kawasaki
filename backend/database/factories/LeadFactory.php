<?php

namespace Database\Factories;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Lead>
 */
class LeadFactory extends Factory
{
    public function definition(): array
    {
        return [
            'lead_code' => 'LD' . str_pad((string)fake()->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'source' => fake()->randomElement(['WALK_IN', 'WEBSITE', 'WHATSAPP', 'INSTAGRAM', 'FACEBOOK', 'REFERRAL', 'EVENT', 'ADVERTISEMENT', 'PHONE', 'OTHER']),
            'estimated_budget' => fake()->numberBetween(50000000, 300000000),
            'notes' => fake()->sentence(),
            'status' => 'COLD',
        ];
    }
}