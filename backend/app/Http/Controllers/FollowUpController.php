<?php

namespace App\Http\Controllers;

use App\Models\FollowUp;
use App\Models\Lead;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FollowUpController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = FollowUp::with(['lead', 'customer', 'salesperson']);

        if ($request->filled('salesperson_id')) {
            $query->where('salesperson_id', $request->salesperson_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('follow_up_date')) {
            $query->whereDate('follow_up_date', $request->follow_up_date);
        }

        $query->latest();

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lead_id' => 'nullable|exists:leads,id',
            'customer_id' => 'nullable|exists:customers,id',
            'salesperson_id' => 'required|exists:salespersons,id',
            'follow_up_date' => 'required|date',
            'follow_up_time' => 'nullable|date_format:H:i',
            'channel' => 'in:PHONE,WHATSAPP,EMAIL,VISIT,SHOWROOM,VIDEO_CALL,OTHER',
            'purpose' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'result' => 'nullable|string',
            'next_follow_up_at' => 'nullable|date',
            'status' => 'in:PLANNED,COMPLETED,MISSED,CANCELLED',
        ]);

        $followUp = FollowUp::create($validated);

        return $this->success($followUp->load(['lead', 'customer', 'salesperson']), 'Follow-up created successfully', 201);
    }

    public function show(FollowUp $followUp): JsonResponse
    {
        $followUp->load(['lead', 'customer', 'salesperson']);

        return $this->success($followUp);
    }

    public function update(Request $request, FollowUp $followUp): JsonResponse
    {
        $validated = $request->validate([
            'lead_id' => 'nullable|exists:leads,id',
            'customer_id' => 'nullable|exists:customers,id',
            'salesperson_id' => 'required|exists:salespersons,id',
            'follow_up_date' => 'required|date',
            'follow_up_time' => 'nullable|date_format:H:i',
            'channel' => 'in:PHONE,WHATSAPP,EMAIL,VISIT,SHOWROOM,VIDEO_CALL,OTHER',
            'purpose' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'result' => 'nullable|string',
            'next_follow_up_at' => 'nullable|date',
            'status' => 'in:PLANNED,COMPLETED,MISSED,CANCELLED',
        ]);

        $followUp->update($validated);

        return $this->success($followUp->load(['lead', 'customer', 'salesperson']), 'Follow-up updated successfully');
    }

    public function destroy(FollowUp $followUp): JsonResponse
    {
        $followUp->delete();

        return $this->success(null, 'Follow-up deleted successfully');
    }

    public function complete(Request $request, FollowUp $followUp): JsonResponse
    {
        $validated = $request->validate([
            'result' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $followUp->update([
            'status' => 'COMPLETED',
            'result' => $validated['result'] ?? null,
            'notes' => $validated['notes'] ?? $followUp->notes,
        ]);

        return $this->success($followUp, 'Follow-up completed successfully');
    }

    public function today(Request $request): JsonResponse
    {
        $query = FollowUp::with(['lead', 'customer', 'salesperson'])
            ->whereDate('follow_up_date', now()->toDateString())
            ->where('status', 'PLANNED');

        if ($request->filled('salesperson_id')) {
            $query->where('salesperson_id', $request->salesperson_id);
        }

        return $this->success($query->latest()->get());
    }

    public function overdue(Request $request): JsonResponse
    {
        $query = FollowUp::with(['lead', 'customer', 'salesperson'])
            ->whereDate('follow_up_date', '<', now()->toDateString())
            ->where('status', 'PLANNED');

        if ($request->filled('salesperson_id')) {
            $query->where('salesperson_id', $request->salesperson_id);
        }

        return $this->success($query->latest()->get());
    }

    public function upcoming(Request $request): JsonResponse
    {
        $query = FollowUp::with(['lead', 'customer', 'salesperson'])
            ->whereDate('follow_up_date', '>', now()->toDateString())
            ->where('status', 'PLANNED')
            ->orderBy('follow_up_date')
            ->limit(20);

        if ($request->filled('salesperson_id')) {
            $query->where('salesperson_id', $request->salesperson_id);
        }

        return $this->success($query->get());
    }
}