<?php

namespace App\Http\Controllers;

use App\Models\SalesTransaction;
use App\Models\Lead;
use App\Models\ServiceRecord;
use App\Models\LoyaltyTransaction;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function sales(Request $request): JsonResponse
    {
        $query = SalesTransaction::with(['customer', 'vehicle.model', 'salesperson', 'dealer']);

        if ($request->filled('from_date')) {
            $query->whereDate('sale_date', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('sale_date', '<=', $request->to_date);
        }

        if ($request->filled('dealer_id')) {
            $query->where('dealer_id', $request->dealer_id);
        }

        if ($request->filled('salesperson_id')) {
            $query->where('salesperson_id', $request->salesperson_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $query->latest();

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function salesFunnel(Request $request): JsonResponse
    {
        $query = Lead::query();

        if ($request->filled('dealer_id')) {
            $query->where('dealer_id', $request->dealer_id);
        }

        if ($request->filled('salesperson_id')) {
            $query->where('salesperson_id', $request->salesperson_id);
        }

        $total = $query->count();
        $cold = (clone $query)->where('status', 'COLD')->count();
        $warm = (clone $query)->where('status', 'WARM')->count();
        $hot = (clone $query)->where('status', 'HOT')->count();
        $hold = (clone $query)->where('status', 'HOLD')->count();
        $won = (clone $query)->where('status', 'WON')->count();
        $lost = (clone $query)->where('status', 'LOST')->count();

        return $this->success([
            'total_leads' => $total,
            'cold' => $cold,
            'warm' => $warm,
            'hot' => $hot,
            'hold' => $hold,
            'won' => $won,
            'lost' => $lost,
            'conversion_rate' => $total > 0 ? round($won / $total * 100, 2) : 0,
            'warm_rate' => $total > 0 ? round(($warm + $hot + $won) / $total * 100, 2) : 0,
            'hot_rate' => $total > 0 ? round(($hot + $won) / $total * 100, 2) : 0,
        ]);
    }

    public function salespersonRanking(Request $request): JsonResponse
    {
        $period = $request->period ?? 'monthly';
        $dealerId = $request->dealer_id;

        $salespersons = \App\Models\Salesperson::with('dealer')
            ->when($dealerId, fn($q) => $q->where('dealer_id', $dealerId))
            ->get()
            ->map(function ($sp) {
                $soldQuery = SalesTransaction::where('salesperson_id', $sp->id)->where('status', 'SOLD');
                $totalLeads = Lead::where('salesperson_id', $sp->id)->count();
                $wonLeads = Lead::where('salesperson_id', $sp->id)->where('status', 'WON')->count();

                return [
                    'id' => $sp->id,
                    'name' => $sp->name,
                    'dealer' => $sp->dealer?->name,
                    'units_sold' => $soldQuery->count(),
                    'revenue' => $soldQuery->sum('final_price'),
                    'total_leads' => $totalLeads,
                    'won_leads' => $wonLeads,
                    'conversion_rate' => $totalLeads > 0 ? round($wonLeads / $totalLeads * 100, 2) : 0,
                ];
            })
            ->sortByDesc('units_sold')
            ->values()
            ->map(function ($item, $index) {
                $item['rank'] = $index + 1;
                return $item;
            });

        return $this->success($salespersons);
    }

    public function service(Request $request): JsonResponse
    {
        $query = ServiceRecord::with(['vehicle.model', 'dealer']);

        if ($request->filled('from_date')) {
            $query->whereDate('service_date', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('service_date', '<=', $request->to_date);
        }

        if ($request->filled('dealer_id')) {
            $query->where('dealer_id', $request->dealer_id);
        }

        $query->latest();

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function loyalty(Request $request): JsonResponse
    {
        $totalEarned = LoyaltyTransaction::where('type', 'EARN')->sum('points');
        $totalRedeemed = LoyaltyTransaction::where('type', 'REDEEM')->sum('points');
        $totalExpired = LoyaltyTransaction::where('type', 'EXPIRED')->sum('points');

        return $this->success([
            'total_points_earned' => $totalEarned,
            'total_points_redeemed' => $totalRedeemed,
            'total_points_expired' => $totalExpired,
            'current_balance' => $totalEarned - $totalRedeemed - $totalExpired,
            'total_transactions' => LoyaltyTransaction::count(),
        ]);
    }
}