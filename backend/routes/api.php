<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DealerController;
use App\Http\Controllers\SalespersonController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VehicleModelController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\FollowUpController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\SalesTransactionController;
use App\Http\Controllers\VehicleOwnershipController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\WarrantyController;
use App\Http\Controllers\LoyaltyController;
use App\Http\Controllers\SalesTargetController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public auth routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // Dealers
        Route::apiResource('dealers', DealerController::class);
        Route::get('/dealers/{dealer}/stats', [DealerController::class, 'stats']);

        // Salespersons
        Route::apiResource('salespersons', SalespersonController::class);
        Route::get('/salespersons/{salesperson}/stats', [SalespersonController::class, 'stats']);

        // Customers
        Route::apiResource('customers', CustomerController::class);
        Route::get('/customers/{customer}/360', [CustomerController::class, 'customer360']);
        Route::get('/customers/{customer}/vehicles', [CustomerController::class, 'vehicles']);
        Route::get('/customers/{customer}/sales', [CustomerController::class, 'sales']);
        Route::get('/customers/{customer}/services', [CustomerController::class, 'services']);
        Route::get('/customers/{customer}/loyalty', [CustomerController::class, 'loyalty']);

        // Vehicle Models
        Route::apiResource('vehicle-models', VehicleModelController::class);

        // Leads
        Route::apiResource('leads', LeadController::class);
        Route::put('/leads/{lead}/status', [LeadController::class, 'changeStatus']);
        Route::get('/leads/{lead}/status-histories', [LeadController::class, 'statusHistories']);
        Route::get('/leads/pipeline', [LeadController::class, 'pipeline']);

        // Follow Ups
        Route::apiResource('follow-ups', FollowUpController::class);
        Route::put('/follow-ups/{followUp}/complete', [FollowUpController::class, 'complete']);
        Route::get('/follow-ups/today', [FollowUpController::class, 'today']);
        Route::get('/follow-ups/overdue', [FollowUpController::class, 'overdue']);
        Route::get('/follow-ups/upcoming', [FollowUpController::class, 'upcoming']);

        // Vehicles
        Route::apiResource('vehicles', VehicleController::class);
        Route::get('/vehicles/{vehicle}/360', [VehicleController::class, 'vehicle360']);
        Route::get('/vehicles/{vehicle}/timeline', [VehicleController::class, 'timeline']);
        Route::get('/vehicles/{vehicle}/services', [VehicleController::class, 'services']);
        Route::get('/vehicles/{vehicle}/warranty', [VehicleController::class, 'warranty']);
        Route::get('/vehicles/{vehicle}/ownership', [VehicleController::class, 'ownership']);
        Route::post('/vehicles/{vehicle}/transfer', [VehicleController::class, 'transferOwnership']);

        // Sales Transactions
        Route::apiResource('sales', SalesTransactionController::class);
        Route::put('/sales/{sale}/complete', [SalesTransactionController::class, 'complete']);
        Route::put('/sales/{sale}/cancel', [SalesTransactionController::class, 'cancel']);

// Service
        Route::apiResource('services', ServiceController::class);
        Route::apiResource('service-bookings', ServiceBookingController::class);
        Route::get('/vehicles/{vehicle}/service-records', [ServiceController::class, 'recordsByVehicle']);
        Route::get('/service-schedules', [\App\Http\Controllers\ServiceScheduleController::class, 'index']);
        Route::get('/service-reminders', [\App\Http\Controllers\ServiceScheduleController::class, 'reminders']);

        // Warranty
        Route::apiResource('warranties', \App\Http\Controllers\WarrantyController::class);
        Route::apiResource('warranty-claims', \App\Http\Controllers\WarrantyClaimController::class);
        Route::get('/vehicles/{vehicle}/warranty-claims', [\App\Http\Controllers\WarrantyClaimController::class, 'byVehicle']);

        // Loyalty
        Route::get('/loyalty', [LoyaltyController::class, 'show']);
        Route::get('/loyalty/transactions', [LoyaltyController::class, 'transactions']);
        Route::post('/loyalty/redeem', [LoyaltyController::class, 'redeem']);
        Route::get('/loyalty/rewards', [LoyaltyController::class, 'rewards']);
        Route::get('/loyalty/tiers', [LoyaltyController::class, 'tiers']);

        // Sales Targets
        Route::apiResource('sales-targets', SalesTargetController::class);
        Route::get('/salespersons/{salesperson}/achievement', [SalesTargetController::class, 'achievement']);

        // Reports
        Route::get('/reports/sales', [ReportController::class, 'sales']);
        Route::get('/reports/sales-funnel', [ReportController::class, 'salesFunnel']);
        Route::get('/reports/salesperson-ranking', [ReportController::class, 'salespersonRanking']);
        Route::get('/reports/service', [ReportController::class, 'service']);
        Route::get('/reports/loyalty', [ReportController::class, 'loyalty']);

        // Global search
        Route::get('/search', [\App\Http\Controllers\SearchController::class, 'search']);
    });
});