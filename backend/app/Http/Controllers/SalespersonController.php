<?php

namespace App\Http\Controllers;

use App\Models\Salesperson;
use App\Models\Dealer;
use App\Models\Lead;
use App\Models\FollowUp;
use App\Models\SalesTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SalespersonController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Salesperson::with('dealer');

        if ($request->filled('dealer_id')) {
            $query->where('dealer_id', $request->dealer_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('employee_code', 'like', "%{$search}%")
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
            'employee_code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'dealer_id' => 'required|exists:dealers,id',
            'join_date' => 'nullable|date',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        $salesperson = Salesperson::create($validated);

        return $this->success($salesperson->load('dealer'), 'Salesperson created successfully', 201);
    }

    public function show(Salesperson $salesperson): JsonResponse
    {
        $salesperson->load('dealer');

        $salesperson->stats = [
            'total_leads' => Lead::where('salesperson_id', $salesperson->id)->count(),
            'won_leads' => Lead::where('salesperson_id', $salesperson->id)->where('status', 'WON')->count(),
            'total_follow_ups' => FollowUp::where('salesperson_id', $salesperson->id)->count(),
            'completed_follow_ups' => FollowUp::where('salesperson_id', $salesperson->id)->where('status', 'COMPLETED')->count(),
            'total_sales' => SalesTransaction::where('salesperson_id', $salesperson->id)->where('status', 'SOLD')->count(),
            'total_revenue' => SalesTransaction::where('salesperson_id', $salesperson->id)->where('status', 'SOLD')->sum('final_price'),
        ];

        return $this->success($salesperson);
    }

    public function update(Request $request, Salesperson $salesperson): JsonResponse
    {
        $validated = $request->validate([
            'employee_code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'dealer_id' => 'required|exists:dealers,id',
            'join_date' => 'nullable|date',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        $salesperson->update($validated);

        return $this->success($salesperson->load('dealer'), 'Salesperson updated successfully');
    }

    public function destroy(Salesperson $salesperson): JsonResponse
    {
        $hasChildren = $salesperson->leads()->exists()
            || $salesperson->salesTransactions()->exists()
            || $salesperson->salesTargets()->exists()
            || $salesperson->vehicleOwnerships()->exists();

        if ($hasChildren) {
            return $this->error('Cannot delete salesperson with existing related records', 422);
        }

        $salesperson->followUps()->delete();
        $salesperson->salesActivities()->delete();
        $salesperson->delete();

        return $this->success(null, 'Salesperson deleted successfully');
    }

    public function stats(Salesperson $salesperson): JsonResponse
    {
        return $this->success([
            'total_leads' => Lead::where('salesperson_id', $salesperson->id)->count(),
            'won_leads' => Lead::where('salesperson_id', $salesperson->id)->where('status', 'WON')->count(),
            'lost_leads' => Lead::where('salesperson_id', $salesperson->id)->where('status', 'LOST')->count(),
            'total_sales' => SalesTransaction::where('salesperson_id', $salesperson->id)->where('status', 'SOLD')->count(),
            'total_revenue' => SalesTransaction::where('salesperson_id', $salesperson->id)->where('status', 'SOLD')->sum('final_price'),
            'conversion_rate' => Lead::where('salesperson_id', $salesperson->id)->count() > 0
                ? round(Lead::where('salesperson_id', $salesperson->id)->where('status', 'WON')->count() / Lead::where('salesperson_id', $salesperson->id)->count() * 100, 2)
                : 0,
        ]);
    }
}