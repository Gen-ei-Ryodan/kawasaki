<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Vehicle>
 */
class VehicleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'vehicle_code' => 'VEH' . str_pad((string)fake()->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
            'vin' => strtoupper(Str::random(17)),
            'engine_number' => strtoupper(Str::random(12)),
            'color' => fake()->safeColorName(),
            'year' => fake()->numberBetween(2022, 2025),
            'license_plate' => fake()->bothify('?? #### ??'),
            'status' => 'IN_STOCK',
        ];
    }
}