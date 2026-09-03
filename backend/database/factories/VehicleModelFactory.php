<?php

namespace Database\Factories;

use App\Models\VehicleModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VehicleModel>
 */
class VehicleModelFactory extends Factory
{
    public function definition(): array
    {
        $names = ['Ninja 250', 'Ninja 400', 'Ninja 650', 'Z900', 'Z650', 'Versys 650', 'Versys 1000', 'W800', 'Vulcan S', 'Eliminator'];
        $model = fake()->unique()->randomElement($names);
        
        return [
            'brand' => 'Kawasaki',
            'model' => $model,
            'variant' => fake()->randomElement(['ABS', 'Non-ABS', 'Special Edition', 'Standard']),
            'year' => fake()->numberBetween(2022, 2025),
            'engine_cc' => fake()->randomElement([250, 400, 650, 900, 1000]),
            'description' => fake()->sentence(),
            'status' => 'ACTIVE',
        ];
    }
}