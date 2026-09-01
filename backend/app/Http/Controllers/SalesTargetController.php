<?php

namespace App\Http\Controllers;

use App\Models\SalesTarget;
use App\Models\SalesTransaction;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SalesTargetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SalesTarget::with(['salesperson', 'dealer']);

        if ($request->filled('salesperson_id')) {
            $query->where('salesperson_id', $request->salesperson_id);
        }

        if ($request->filled('dealer_id')) {
            $query->where('dealer_id', $request->dealer_id);
        }

        if ($request->filled('period')) {
            $query->where('period', $request->period);
        }

        $query->latest();

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'salesperson_id' => 'required|exists:salespersons,id',
            'dealer_id' => 'nullable|exists:dealers,id',
            'period' => 'required|string|max:7',
            'target_units' => 'required|integer',
            'target_revenue' => 'required|numeric',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'in:ACTIVE,COMPLETED,CANCELLED',
        ]);

        $target = SalesTarget::create($validated);

        return $this->success($target->load(['salesperson', 'dealer']), 'Sales target created successfully', 201);
    }

    public function show(SalesTarget $target): JsonResponse
    {
        $target->load(['salesperson', 'dealer']);

        $target->achievement = $this->calculateAchievement($target);

        return $this->success($target);
    }

    public function update(Request $request, SalesTarget $target): JsonResponse
    {
        $validated = $request->validate([
            'salesperson_id' => 'required|exists:salespersons,id',
            'dealer_id' => 'nullable|exists:dealers,id',
            'period' => 'required|string|max:7',
            'target_units' => 'required|integer',
            'target_revenue' => 'required|numeric',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'in:ACTIVE,COMPLETED,CANCELLED',
        ]);

        $target->update($validated);

        return $this->success($target->load(['salesperson', 'dealer']), 'Sales target updated successfully');
    }

    public function destroy(SalesTarget $target): JsonResponse
    {
        $target->delete();

        return $this->success(null, 'Sales target deleted successfully');
    }

    public function achievement(Request $request, $salespersonId): JsonResponse
    {
        $period = $request->period ?? now()->format('Y-m');

        $target = SalesTarget::where('salesperson_id', $salespersonId)
            ->where('period', $period)
            ->first();

        if (!$target) {
            return $this->error('No target found for this period', 404);
        }

        $achievement = $this->calculateAchievement($target);

        return $this->success($achievement);
    }

    private function calculateAchievement(SalesTarget $target): array
    {
        $query = SalesTransaction::where('salesperson_id', $target->salesperson_id)
            ->where('status', 'SOLD');

        if ($target->start_date && $target->end_date) {
            $query->whereBetween('sale_date', [$target->start_date, $target->end_date]);
        }

        $unitsSold = $query->count();
        $revenue = $query->sum('final_price');

        return [
            'target_id' => $target->id,
            'period' => $target->period,
            'target_units' => $target->target_units,
            'units_sold' => $unitsSold,
            'achievement_units' => $target->target_units > 0 ? round($unitsSold / $target->target_units * 100, 2) : 0,
            'target_revenue' => $target->target_revenue,
            'actual_revenue' => $revenue,
            'achievement_revenue' => $target->target_revenue > 0 ? round($revenue / $target->target_revenue * 100, 2) : 0,
        ];
    }
}