<?php

namespace App\Http\Controllers;

use App\Models\SalesTransaction;
use App\Models\Vehicle;
use App\Models\VehicleOwnership;
use App\Models\VehicleTimeline;
use App\Models\LoyaltyTransaction;
use App\Models\LoyaltyAccount;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class SalesTransactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SalesTransaction::with(['customer', 'vehicle.model', 'salesperson', 'dealer']);

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('salesperson_id')) {
            $query->where('salesperson_id', $request->salesperson_id);
        }

        if ($request->filled('dealer_id')) {
            $query->where('dealer_id', $request->dealer_id);
        }

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('transaction_number', 'like', "%{$search}%")
                  ->orwhereHas('customer', fn($cq) => $cq->where('full_name', 'like', "%{$search}%"));
            });
        }

        $query->latest();

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lead_id' => 'nullable|exists:leads,id',
            'customer_id' => 'nullable|exists:customers,id',
            'salesperson_id' => 'nullable|exists:salespersons,id',
            'dealer_id' => 'nullable|exists:dealers,id',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'sale_date' => 'nullable|date',
            'vehicle_price' => 'nullable|numeric',
            'discount' => 'nullable|numeric',
            'additional_cost' => 'nullable|numeric',
            'final_price' => 'nullable|numeric',
            'payment_method' => 'in:CASH,CREDIT,BANK_TRANSFER,OTHER',
            'payment_status' => 'in:UNPAID,PARTIAL,PAID',
            'status' => 'in:DRAFT,BOOKED,SOLD,CANCELLED',
        ]);

        $validated['transaction_number'] = 'TXN' . str_pad((string)(SalesTransaction::max('id') + 1), 6, '0', STR_PAD_LEFT);

        $vehiclePrice = $validated['vehicle_price'] ?? 0;
        $discount = $validated['discount'] ?? 0;
        $additionalCost = $validated['additional_cost'] ?? 0;
        $validated['final_price'] = $validated['final_price'] ?? ($vehiclePrice - $discount + $additionalCost);

        $sale = SalesTransaction::create($validated);

        return $this->success($sale->load(['customer', 'vehicle.model', 'salesperson', 'dealer']), 'Sales transaction created successfully', 201);
    }

    public function show(SalesTransaction $sale): JsonResponse
    {
        $sale->load(['customer', 'vehicle.model', 'salesperson', 'dealer', 'lead']);

        return $this->success($sale);
    }

    public function update(Request $request, SalesTransaction $sale): JsonResponse
    {
        $validated = $request->validate([
            'lead_id' => 'nullable|exists:leads,id',
            'customer_id' => 'nullable|exists:customers,id',
            'salesperson_id' => 'nullable|exists:salespersons,id',
            'dealer_id' => 'nullable|exists:dealers,id',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'sale_date' => 'nullable|date',
            'vehicle_price' => 'nullable|numeric',
            'discount' => 'nullable|numeric',
            'additional_cost' => 'nullable|numeric',
            'final_price' => 'nullable|numeric',
            'payment_method' => 'in:CASH,CREDIT,BANK_TRANSFER,OTHER',
            'payment_status' => 'in:UNPAID,PARTIAL,PAID',
            'status' => 'in:DRAFT,BOOKED,SOLD,CANCELLED',
        ]);

        $sale->update($validated);

        return $this->success($sale->load(['customer', 'vehicle.model', 'salesperson', 'dealer']), 'Sales transaction updated successfully');
    }

    public function destroy(SalesTransaction $sale): JsonResponse
    {
        $sale->ownerships()->delete();
        $sale->delete();

        return $this->success(null, 'Sales transaction deleted successfully');
    }

    public function complete(Request $request, SalesTransaction $sale): JsonResponse
    {
        $validated = $request->validate([
            'delivery_date' => 'nullable|date',
            'payment_status' => 'in:UNPAID,PARTIAL,PAID',
        ]);

        DB::transaction(function () use ($sale, $validated) {
            $sale->update([
                'status' => 'SOLD',
                'payment_status' => $validated['payment_status'] ?? $sale->payment_status,
                'sale_date' => $sale->sale_date ?? now()->toDateString(),
            ]);

            // Update vehicle status
            if ($sale->vehicle) {
                $sale->vehicle->update(['status' => 'DELIVERED']);
            }

            // Create ownership
            if ($sale->vehicle && $sale->customer_id) {
                VehicleOwnership::create([
                    'vehicle_id' => $sale->vehicle_id,
                    'customer_id' => $sale->customer_id,
                    'purchase_transaction_id' => $sale->id,
                    'dealer_id' => $sale->dealer_id,
                    'salesperson_id' => $sale->salesperson_id,
                    'purchase_date' => $sale->sale_date,
                    'delivery_date' => $validated['delivery_date'] ?? null,
                    'ownership_start' => now(),
                    'status' => 'CURRENT',
                ]);

                // Create timeline event
                VehicleTimeline::create([
                    'vehicle_id' => $sale->vehicle_id,
                    'event_type' => 'PURCHASE',
                    'event_date' => $sale->sale_date ?? now()->toDateString(),
                    'title' => 'Vehicle Purchased',
                    'description' => "Vehicle purchased by customer {$sale->customer_id}",
                    'reference_type' => SalesTransaction::class,
                    'reference_id' => $sale->id,
                    'created_by' => Auth::id(),
                ]);

                // Earn loyalty points
                $this->earnLoyaltyPoints($sale->customer_id, $sale->final_price);
            }
        });

        $sale->load(['customer', 'vehicle.model', 'salesperson', 'dealer']);

        return $this->success($sale, 'Sale completed successfully');
    }

    public function cancel(SalesTransaction $sale): JsonResponse
    {
        $sale->update(['status' => 'CANCELLED']);

        return $this->success($sale, 'Sales transaction cancelled successfully');
    }

    private function earnLoyaltyPoints(int $customerId, float $amount): void
    {
        $points = (int)floor($amount / 1000); // 1 point per Rp1,000

        if ($points > 0) {
            $account = LoyaltyAccount::firstOrCreate(
                ['customer_id' => $customerId],
                ['status' => 'ACTIVE']
            );

            LoyaltyTransaction::create([
                'customer_id' => $customerId,
                'type' => 'EARN',
                'points' => $points,
                'reference_type' => SalesTransaction::class,
                'description' => "Earned from purchase of Rp{$amount}",
            ]);
        }
    }
}