<?php

namespace App\Http\Controllers;

use App\Models\Warranty;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WarrantyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Warranty::with(['vehicle.model', 'customer']);

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('warranty_number', 'like', "%{$search}%")
                  ->orwhereHas('vehicle', fn($vq) => $vq->where('vin', 'like', "%{$search}%"));
            });
        }

        $query->latest();

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'customer_id' => 'nullable|exists:customers,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'warranty_period' => 'required|integer',
            'status' => 'in:ACTIVE,EXPIRED,VOID',
            'terms' => 'nullable|string',
        ]);

        $validated['warranty_number'] = 'WRT' . str_pad((string)(Warranty::max('id') + 1), 6, '0', STR_PAD_LEFT);

        $warranty = Warranty::create($validated);

        return $this->success($warranty->load(['vehicle.model', 'customer']), 'Warranty created successfully', 201);
    }

    public function show(Warranty $warranty): JsonResponse
    {
        $warranty->load(['vehicle.model', 'customer', 'claims']);

        return $this->success($warranty);
    }

    public function update(Request $request, Warranty $warranty): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'customer_id' => 'nullable|exists:customers,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'warranty_period' => 'required|integer',
            'status' => 'in:ACTIVE,EXPIRED,VOID',
            'terms' => 'nullable|string',
        ]);

        $warranty->update($validated);

        return $this->success($warranty->load(['vehicle.model', 'customer']), 'Warranty updated successfully');
    }

    public function destroy(Warranty $warranty): JsonResponse
    {
        $warranty->claims()->delete();
        $warranty->delete();

        return $this->success(null, 'Warranty deleted successfully');
    }
}