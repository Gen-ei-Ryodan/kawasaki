<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\Vehicle;
use App\Models\VehicleOwnership;
use App\Models\SalesTransaction;
use App\Models\ServiceRecord;
use App\Models\LoyaltyAccount;
use App\Models\LoyaltyTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Customer::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_code', 'like', "%{$search}%")
                  ->orwhere('full_name', 'like', "%{$search}%")
                  ->orwhere('phone', 'like', "%{$search}%")
                  ->orwhere('email', 'like', "%{$search}%")
                  ->orwhere('nik', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        $query->orderBy('created_at', 'desc');

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_code' => 'required|string|max:50',
            'full_name' => 'required|string|max:255',
            'nik' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'date_of_birth' => 'nullable|date',
            'gender' => 'in:MALE,FEMALE',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:10',
            'occupation' => 'nullable|string|max:100',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        $validated['created_by'] = $request->user()->id;

        $customer = Customer::create($validated);

        return $this->success($customer, 'Customer created successfully', 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        $customer->load([
            'vehicles' => fn($q) => $q->limit(10),
            'salesTransactions' => fn($q) => $q->limit(10),
            'loyaltyAccount',
        ]);

        $customer->stats = [
            'total_vehicles' => Vehicle::where('customer_id', $customer->id)->count(),
            'total_purchases' => SalesTransaction::where('customer_id', $customer->id)->where('status', 'SOLD')->count(),
            'total_services' => ServiceRecord::where('customer_id', $customer->id)->count(),
            'loyalty_points' => LoyaltyTransaction::where('customer_id', $customer->id)
                ->selectRaw('SUM(CASE WHEN type = "EARN" THEN points ELSE 0 END) - SUM(CASE WHEN type = "REDEEM" THEN points ELSE 0 END) - SUM(CASE WHEN type = "EXPIRED" THEN points ELSE 0 END) + SUM(CASE WHEN type = "ADJUSTMENT" THEN points ELSE 0 END) as balance')
                ->value('balance') ?? 0,
        ];

        return $this->success($customer);
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $validated = $request->validate([
            'customer_code' => 'required|string|max:50',
            'full_name' => 'required|string|max:255',
            'nik' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'date_of_birth' => 'nullable|date',
            'gender' => 'in:MALE,FEMALE',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:10',
            'occupation' => 'nullable|string|max:100',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        $customer->update($validated);

        return $this->success($customer, 'Customer updated successfully');
    }

    public function destroy(Customer $customer): JsonResponse
    {
        // Delete related records first (order matters due to foreign keys)
        $customer->loyaltyTransactions()->delete();
        $customer->loyaltyAccount()?->delete();
        $customer->followUps()->delete();
        $customer->salesActivities()->delete();
        $customer->rewardRedemptions()->delete();
        $customer->vouchers()->delete();
        $customer->serviceBookings()->delete();

        $customer->delete();

        return $this->success(null, 'Customer deleted successfully');
    }

    public function customer360(Customer $customer): JsonResponse
    {
        $customer->load([
            'vehicles' => fn($q) => $q->with(['model', 'currentOwner']),
            'salesTransactions' => fn($q) => $q->latest()->limit(10),
            'loyaltyAccount.tier',
        ]);

        $customer->stats = [
            'total_vehicles' => $customer->vehicles->count(),
            'total_purchases' => $customer->salesTransactions->where('status', 'SOLD')->count(),
            'total_services' => ServiceRecord::where('customer_id', $customer->id)->count(),
            'loyalty_points' => LoyaltyTransaction::where('customer_id', $customer->id)
                ->selectRaw('SUM(CASE WHEN type = "EARN" THEN points ELSE 0 END) - SUM(CASE WHEN type = "REDEEM" THEN points ELSE 0 END) - SUM(CASE WHEN type = "EXPIRED" THEN points ELSE 0 END) + SUM(CASE WHEN type = "ADJUSTMENT" THEN points ELSE 0 END) as balance')
                ->value('balance') ?? 0,
            'current_tier' => $customer->loyaltyAccount?->tier?->name ?? 'Bronze',
        ];

        return $this->success($customer);
    }

    public function vehicles(Customer $customer): JsonResponse
    {
        $vehicles = $customer->vehicles()
            ->with(['model', 'currentOwner.customer', 'currentOwner.salesperson'])
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($vehicles);
    }

    public function sales(Customer $customer): JsonResponse
    {
        $sales = $customer->salesTransactions()
            ->with(['vehicle.model', 'salesperson', 'dealer'])
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($sales);
    }

    public function services(Customer $customer): JsonResponse
    {
        $services = $customer->serviceRecords()
            ->with(['vehicle.model', 'dealer'])
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($services);
    }

    public function loyalty(Customer $customer): JsonResponse
    {
        $account = $customer->loyaltyAccount;

        if (!$account) {
            return $this->success([
                'account' => null,
                'balance' => 0,
                'tier' => 'Bronze',
            ]);
        }

        $balance = LoyaltyTransaction::where('customer_id', $customer->id)
            ->selectRaw('SUM(CASE WHEN type = "EARN" THEN points ELSE 0 END) - SUM(CASE WHEN type = "REDEEM" THEN points ELSE 0 END) - SUM(CASE WHEN type = "EXPIRED" THEN points ELSE 0 END) + SUM(CASE WHEN type = "ADJUSTMENT" THEN points ELSE 0 END) as balance')
            ->value('balance') ?? 0;

        return $this->success([
            'account' => $account,
            'balance' => $balance,
            'tier' => $account->tier?->name ?? 'Bronze',
            'transactions' => $account->transactions()->latest()->limit(10)->get(),
        ]);
    }
}