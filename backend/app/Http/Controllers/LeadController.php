<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\LeadStatusHistory;
use App\Models\FollowUp;
use App\Models\SalesActivity;
use App\Models\VehicleModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class LeadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Lead::with(['dealer', 'salesperson', 'interestedModel']);

        if ($request->filled('salesperson_id')) {
            $query->where('salesperson_id', $request->salesperson_id);
        }

        if ($request->filled('dealer_id')) {
            $query->where('dealer_id', $request->dealer_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('source')) {
            $query->where('source', $request->source);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('lead_code', 'like', "%{$search}%")
                  ->orwhere('name', 'like', "%{$search}%")
                  ->orwhere('phone', 'like', "%{$search}%")
                  ->orwhere('email', 'like', "%{$search}%");
            });
        }

        $query->latest();

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'source' => 'in:WALK_IN,WEBSITE,WHATSAPP,INSTAGRAM,FACEBOOK,REFERRAL,EVENT,ADVERTISEMENT,PHONE,OTHER',
            'interested_model_id' => 'nullable|exists:vehicle_models,id',
            'salesperson_id' => 'nullable|exists:salespersons,id',
            'dealer_id' => 'nullable|exists:dealers,id',
            'estimated_budget' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'status' => 'in:COLD,WARM,HOT,HOLD,WON,LOST',
        ]);

        $validated['lead_code'] = 'LD' . str_pad((string)(Lead::max('id') + 1), 6, '0', STR_PAD_LEFT);

        $lead = Lead::create($validated);

        return $this->success($lead->load(['dealer', 'salesperson', 'interestedModel']), 'Lead created successfully', 201);
    }

    public function show(Lead $lead): JsonResponse
    {
        $lead->load([
            'dealer',
            'salesperson',
            'interestedModel',
            'statusHistories.changedBy',
            'followUps' => fn($q) => $q->latest()->limit(10),
            'salesActivities' => fn($q) => $q->latest()->limit(10),
            'salesTransactions' => fn($q) => $q->latest()->limit(10),
        ]);

        return $this->success($lead);
    }

    public function update(Request $request, Lead $lead): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'source' => 'in:WALK_IN,WEBSITE,WHATSAPP,INSTAGRAM,FACEBOOK,REFERRAL,EVENT,ADVERTISEMENT,PHONE,OTHER',
            'interested_model_id' => 'nullable|exists:vehicle_models,id',
            'salesperson_id' => 'nullable|exists:salespersons,id',
            'dealer_id' => 'nullable|exists:dealers,id',
            'estimated_budget' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'status' => 'in:COLD,WARM,HOT,HOLD,WON,LOST',
        ]);

        $lead->update($validated);

        return $this->success($lead->load(['dealer', 'salesperson', 'interestedModel']), 'Lead updated successfully');
    }

    public function destroy(Lead $lead): JsonResponse
    {
        $lead->delete();

        return $this->success(null, 'Lead deleted successfully');
    }

    public function changeStatus(Request $request, Lead $lead): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:COLD,WARM,HOT,HOLD,WON,LOST',
            'reason' => 'nullable|string',
        ]);

        $oldStatus = $lead->status;
        $lead->update(['status' => $validated['status']]);

        LeadStatusHistory::create([
            'lead_id' => $lead->id,
            'old_status' => $oldStatus,
            'new_status' => $validated['status'],
            'reason' => $validated['reason'] ?? null,
            'changed_by' => Auth::id(),
        ]);

        return $this->success($lead, 'Lead status changed successfully');
    }

    public function statusHistories(Lead $lead): JsonResponse
    {
        $histories = $lead->statusHistories()
            ->with('changedBy')
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($histories);
    }

    public function pipeline(Request $request): JsonResponse
    {
        $query = Lead::with(['dealer', 'salesperson', 'interestedModel']);

        if ($request->filled('salesperson_id')) {
            $query->where('salesperson_id', $request->salesperson_id);
        }

        if ($request->filled('dealer_id')) {
            $query->where('dealer_id', $request->dealer_id);
        }

        $leads = $query->latest()->get();

        $pipeline = [
            'COLD' => [],
            'WARM' => [],
            'HOT' => [],
            'HOLD' => [],
            'WON' => [],
            'LOST' => [],
        ];

        foreach ($leads as $lead) {
            $pipeline[$lead->status][] = $lead;
        }

        $pipeline['counts'] = [
            'COLD' => Lead::clone()->where('status', 'COLD')->count(),
            'WARM' => Lead::clone()->where('status', 'WARM')->count(),
            'HOT' => Lead::clone()->where('status', 'HOT')->count(),
            'HOLD' => Lead::clone()->where('status', 'HOLD')->count(),
            'WON' => Lead::clone()->where('status', 'WON')->count(),
            'LOST' => Lead::clone()->where('status', 'LOST')->count(),
            'total' => Lead::clone()->count(),
        ];

        return $this->success($pipeline);
    }
}