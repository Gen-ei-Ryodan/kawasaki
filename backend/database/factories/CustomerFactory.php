<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'customer_code' => 'CUST' . str_pad((string)fake()->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
            'full_name' => fake()->name(),
            'nik' => fake()->unique()->numerify('################'),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'date_of_birth' => fake()->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'gender' => fake()->randomElement(['MALE', 'FEMALE']),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'province' => fake()->state(),
            'postal_code' => fake()->postcode(),
            'occupation' => fake()->jobTitle(),
            'status' => 'ACTIVE',
        ];
    }
}