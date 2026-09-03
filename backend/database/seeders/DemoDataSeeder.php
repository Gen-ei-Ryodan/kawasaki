<?php

namespace Database\Seeders;

use App\Models\Dealer;
use App\Models\Salesperson;
use App\Models\Customer;
use App\Models\VehicleModel;
use App\Models\Vehicle;
use App\Models\Lead;
use App\Models\LoyaltyTier;
use App\Models\Reward;
use App\Models\LoyaltyAccount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Create Dealers
        $dealers = Dealer::factory()->count(3)->create([
            'status' => 'ACTIVE',
        ]);

        // Create Salespersons
        $salespersons = collect();
        foreach ($dealers as $dealer) {
            $salespersons = $salespersons->merge(Salesperson::factory()->count(3)->create([
                'dealer_id' => $dealer->id,
                'status' => 'ACTIVE',
            ]));
        }

        // Create Customers
        $customers = Customer::factory()->count(20)->create();

        // Create Vehicle Models
        $models = VehicleModel::factory()->count(5)->create([
            'status' => 'ACTIVE',
        ]);

        // Create Vehicles
        $vehicles = collect();
        foreach ($models as $model) {
            foreach ($dealers as $dealer) {
                $vehicles = $vehicles->merge(Vehicle::factory()->count(2)->create([
                    'vehicle_model_id' => $model->id,
                    'dealer_id' => $dealer->id,
                    'status' => 'IN_STOCK',
                ]));
            }
        }

        // Create Leads with various statuses
        $statuses = ['COLD', 'WARM', 'HOT', 'HOLD', 'WON', 'LOST'];
        foreach ($statuses as $status) {
            Lead::factory()->count(5)->create([
                'status' => $status,
                'dealer_id' => $dealers->random()->id,
                'salesperson_id' => $salespersons->random()->id,
                'interested_model_id' => $models->random()->id,
            ]);
        }

        // Create Loyalty Tiers
        LoyaltyTier::factory()->create([
            'name' => 'Bronze',
            'minimum_points' => 0,
            'benefits' => 'Basic membership benefits',
            'status' => 'ACTIVE',
        ]);

        LoyaltyTier::factory()->create([
            'name' => 'Silver',
            'minimum_points' => 1000,
            'benefits' => '5% discount on services, priority booking',
            'status' => 'ACTIVE',
        ]);

        LoyaltyTier::factory()->create([
            'name' => 'Gold',
            'minimum_points' => 5000,
            'benefits' => '10% discount on services, free vehicle inspection, birthday gift',
            'status' => 'ACTIVE',
        ]);

        LoyaltyTier::factory()->create([
            'name' => 'Platinum',
            'minimum_points' => 15000,
            'benefits' => '15% discount on services, free annual service, dedicated support, exclusive events',
            'status' => 'ACTIVE',
        ]);

        // Create Rewards
        $rewards = [
            ['code' => 'REW001', 'name' => 'Free Oil Change', 'description' => 'Complimentary oil change service', 'points_required' => 500, 'stock' => 50, 'status' => 'ACTIVE'],
            ['code' => 'REW002', 'name' => 'Car Wash Voucher', 'description' => 'Free car wash and detailing', 'points_required' => 300, 'stock' => 100, 'status' => 'ACTIVE'],
            ['code' => 'REW003', 'name' => 'Service Discount 10%', 'description' => '10% off on any service', 'points_required' => 800, 'stock' => 30, 'status' => 'ACTIVE'],
            ['code' => 'REW004', 'name' => 'Accessories Voucher', 'description' => 'Rp500.000 voucher for accessories', 'points_required' => 1000, 'stock' => 20, 'status' => 'ACTIVE'],
            ['code' => 'REW005', 'name' => 'Free Inspection', 'description' => 'Complimentary 30-point vehicle inspection', 'points_required' => 600, 'stock' => 40, 'status' => 'ACTIVE'],
            ['code' => 'REW006', 'name' => 'Tire Rotation', 'description' => 'Free tire rotation service', 'points_required' => 400, 'stock' => 60, 'status' => 'ACTIVE'],
            ['code' => 'REW007', 'name' => 'Brake Check', 'description' => 'Free brake system inspection', 'points_required' => 350, 'stock' => 50, 'status' => 'ACTIVE'],
            ['code' => 'REW008', 'name' => 'Battery Test', 'description' => 'Free battery health check', 'points_required' => 200, 'stock' => 80, 'status' => 'ACTIVE'],
        ];

        foreach ($rewards as $reward) {
            Reward::factory()->create($reward);
        }

        // Create Loyalty Accounts for customers
        foreach ($customers as $customer) {
            $tier = LoyaltyTier::where('minimum_points', 0)->first();
            LoyaltyAccount::factory()->create([
                'customer_id' => $customer->id,
                'tier_id' => $tier->id,
            ]);
        }

        // Create some Loyalty Transactions
        foreach ($customers->take(10) as $customer) {
            \App\Models\LoyaltyTransaction::factory()->count(rand(3, 8))->create([
                'customer_id' => $customer->id,
                'type' => 'EARN',
                'points' => rand(100, 1000),
                'description' => 'Service visit',
            ]);
        }
    }
}