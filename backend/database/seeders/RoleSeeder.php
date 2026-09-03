<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Dealer;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            // Dealers
            'view-dealers', 'create-dealers', 'edit-dealers', 'delete-dealers',
            // Salespersons
            'view-salespersons', 'create-salespersons', 'edit-salespersons', 'delete-salespersons',
            // Customers
            'view-customers', 'create-customers', 'edit-customers', 'delete-customers',
            // Vehicle Models
            'view-vehicle-models', 'create-vehicle-models', 'edit-vehicle-models', 'delete-vehicle-models',
            // Vehicles
            'view-vehicles', 'create-vehicles', 'edit-vehicles', 'delete-vehicles',
            // Leads
            'view-leads', 'create-leads', 'edit-leads', 'delete-leads', 'manage-lead-status',
            // Sales
            'view-sales', 'create-sales', 'edit-sales', 'delete-sales',
            // Services
            'view-services', 'create-services', 'edit-services', 'delete-services',
            // Service Bookings
            'view-service-bookings', 'create-service-bookings', 'edit-service-bookings', 'delete-service-bookings',
            // Warranties
            'view-warranties', 'create-warranties', 'edit-warranties', 'delete-warranties',
            // Warranty Claims
            'view-warranty-claims', 'create-warranty-claims', 'edit-warranty-claims', 'delete-warranty-claims',
            // Loyalty
            'view-loyalty', 'manage-loyalty',
            // Reports
            'view-reports',
            // Follow-ups
            'view-follow-ups', 'create-follow-ups', 'edit-follow-ups', 'delete-follow-ups',
            // Sales Targets
            'view-sales-targets', 'create-sales-targets', 'edit-sales-targets', 'delete-sales-targets',
            // Notifications
            'view-notifications',
            // Documents
            'view-documents',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        // Create Roles & assign permissions
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->syncPermissions($permissions);

        $manager = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $manager->syncPermissions([
            'view-dealers', 'edit-dealers',
            'view-salespersons', 'create-salespersons', 'edit-salespersons',
            'view-customers', 'create-customers', 'edit-customers',
            'view-vehicle-models',
            'view-vehicles', 'create-vehicles', 'edit-vehicles',
            'view-leads', 'create-leads', 'edit-leads', 'manage-lead-status',
            'view-sales', 'create-sales', 'edit-sales',
            'view-services', 'create-services', 'edit-services',
            'view-service-bookings', 'create-service-bookings', 'edit-service-bookings',
            'view-warranties', 'create-warranties', 'edit-warranties',
            'view-warranty-claims', 'create-warranty-claims', 'edit-warranty-claims',
            'view-loyalty', 'manage-loyalty',
            'view-reports',
            'view-follow-ups', 'create-follow-ups', 'edit-follow-ups',
            'view-sales-targets', 'create-sales-targets', 'edit-sales-targets',
            'view-notifications',
            'view-documents',
        ]);

        $salesperson = Role::firstOrCreate(['name' => 'salesperson', 'guard_name' => 'web']);
        $salesperson->syncPermissions([
            'view-customers', 'create-customers', 'edit-customers',
            'view-vehicles',
            'view-leads', 'create-leads', 'edit-leads', 'manage-lead-status',
            'view-sales', 'create-sales',
            'view-follow-ups', 'create-follow-ups', 'edit-follow-ups',
            'view-sales-targets',
            'view-notifications',
            'view-documents',
        ]);

        $serviceAdvisor = Role::firstOrCreate(['name' => 'service_advisor', 'guard_name' => 'web']);
        $serviceAdvisor->syncPermissions([
            'view-customers',
            'view-vehicles',
            'view-services', 'create-services', 'edit-services',
            'view-service-bookings', 'create-service-bookings', 'edit-service-bookings',
            'view-warranties', 'create-warranties',
            'view-warranty-claims', 'create-warranty-claims', 'edit-warranty-claims',
            'view-notifications',
        ]);

        // Create test users for each role
        $dealer = Dealer::first();

        // Admin
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@kawasaki.com'],
            [
                'name' => 'Admin',
                'password' => 'password',
                'phone' => '081234567890',
                'dealer_id' => $dealer?->id,
            ]
        );
        $adminUser->syncRoles(['admin']);

        // Manager
        $managerUser = User::firstOrCreate(
            ['email' => 'manager@kawasaki.com'],
            [
                'name' => 'Manager',
                'password' => 'password',
                'phone' => '081234567891',
                'dealer_id' => $dealer?->id,
            ]
        );
        $managerUser->syncRoles(['manager']);

        // Salesperson
        $salesUser = User::firstOrCreate(
            ['email' => 'sales@kawasaki.com'],
            [
                'name' => 'Salesperson',
                'password' => 'password',
                'phone' => '081234567892',
                'dealer_id' => $dealer?->id,
            ]
        );
        $salesUser->syncRoles(['salesperson']);

        // Service Advisor
        $serviceUser = User::firstOrCreate(
            ['email' => 'service@kawasaki.com'],
            [
                'name' => 'Service Advisor',
                'password' => 'password',
                'phone' => '081234567893',
                'dealer_id' => $dealer?->id,
            ]
        );
        $serviceUser->syncRoles(['service_advisor']);

        // Assign roles to existing test user
        $testUser = User::where('email', 'test@example.com')->first();
        if ($testUser) {
            $testUser->syncRoles(['admin']);
        }
    }
}