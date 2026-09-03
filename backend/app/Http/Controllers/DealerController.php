<?php

namespace App\Http\Controllers;

use App\Models\Dealer;
use App\Models\Salesperson;
use App\Models\Customer;
use App\Models\Lead;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DealerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Dealer::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('dealer_code', 'like', "%{$search}%")
                  ->orwhere('name', 'like', "%{$search}%")
                  ->orwhere('phone', 'like', "%{$search}%")
                  ->orwhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $query->orderBy('created_at', 'desc');

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'dealer_code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        $dealer = Dealer::create($validated);

        return $this->success($dealer, 'Dealer created successfully', 201);
    }

    public function show(Dealer $dealer): JsonResponse
    {
        $dealer->load([
            'salespersons' => fn($q) => $q->limit(10),
            'customers' => fn($q) => $q->limit(10),
            'vehicles' => fn($q) => $q->limit(10),
        ]);

        $dealer->stats = [
            'total_salespersons' => Salesperson::where('dealer_id', $dealer->id)->count(),
            'total_customers' => Customer::where('dealer_id', $dealer->id)->count(),
            'total_leads' => Lead::where('dealer_id', $dealer->id)->count(),
            'total_vehicles' => Vehicle::where('dealer_id', $dealer->id)->count(),
        ];

        return $this->success($dealer);
    }

    public function update(Request $request, Dealer $dealer): JsonResponse
    {
        $validated = $request->validate([
            'dealer_code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        $dealer->update($validated);

        return $this->success($dealer, 'Dealer updated successfully');
    }

    public function destroy(Dealer $dealer): JsonResponse
    {
        $hasChildren = $dealer->salespersons()->exists()
            || $dealer->customers()->exists()
            || $dealer->leads()->exists()
            || $dealer->vehicles()->exists()
            || $dealer->salesTransactions()->exists()
            || $dealer->serviceRecords()->exists()
            || $dealer->serviceBookings()->exists();

        if ($hasChildren) {
            return $this->error('Cannot delete dealer with existing related records', 422);
        }

        $dealer->delete();

        return $this->success(null, 'Dealer deleted successfully');
    }

    public function stats(Dealer $dealer): JsonResponse
    {
        return $this->success([
            'total_salespersons' => Salesperson::where('dealer_id', $dealer->id)->count(),
            'total_customers' => Customer::where('dealer_id', $dealer->id)->count(),
            'total_leads' => Lead::where('dealer_id', $dealer->id)->count(),
            'total_vehicles' => Vehicle::where('dealer_id', $dealer->id)->count(),
            'won_leads' => Lead::where('dealer_id', $dealer->id)->where('status', 'WON')->count(),
            'lost_leads' => Lead::where('dealer_id', $dealer->id)->where('status', 'LOST')->count(),
        ]);
    }
}