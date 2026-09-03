<?php

namespace Database\Factories;

use App\Models\Dealer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Dealer>
 */
class DealerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'dealer_code' => 'DLR' . str_pad((string)fake()->unique()->numberBetween(1, 999), 3, '0', STR_PAD_LEFT),
            'name' => fake()->company() . ' Kawasaki',
            'phone' => fake()->phoneNumber(),
            'email' => fake()->unique()->companyEmail(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'province' => fake()->state(),
            'status' => 'ACTIVE',
        ];
    }
}