<?php

namespace App\Http\Controllers;

use App\Models\WarrantyClaim;
use App\Models\Warranty;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WarrantyClaimController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = WarrantyClaim::with(['vehicle.model', 'customer', 'warranty']);

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $query->latest();

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'customer_id' => 'nullable|exists:customers,id',
            'warranty_id' => 'nullable|exists:warranties,id',
            'service_record_id' => 'nullable|exists:service_records,id',
            'claim_date' => 'required|date',
            'problem' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'resolution' => 'nullable|string',
            'cost' => 'nullable|numeric',
            'status' => 'in:SUBMITTED,UNDER_REVIEW,APPROVED,REJECTED,COMPLETED',
        ]);

        $validated['claim_number'] = 'WCL' . str_pad((string)(WarrantyClaim::max('id') + 1), 6, '0', STR_PAD_LEFT);

        $claim = WarrantyClaim::create($validated);

        return $this->success($claim->load(['vehicle.model', 'customer', 'warranty']), 'Warranty claim created successfully', 201);
    }

    public function show(WarrantyClaim $claim): JsonResponse
    {
        $claim->load(['vehicle.model', 'customer', 'warranty']);

        return $this->success($claim);
    }

    public function update(Request $request, WarrantyClaim $claim): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'customer_id' => 'nullable|exists:customers,id',
            'warranty_id' => 'nullable|exists:warranties,id',
            'service_record_id' => 'nullable|exists:service_records,id',
            'claim_date' => 'required|date',
            'problem' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'resolution' => 'nullable|string',
            'cost' => 'nullable|numeric',
            'status' => 'in:SUBMITTED,UNDER_REVIEW,APPROVED,REJECTED,COMPLETED',
        ]);

        $claim->update($validated);

        return $this->success($claim->load(['vehicle.model', 'customer', 'warranty']), 'Warranty claim updated successfully');
    }

    public function destroy(WarrantyClaim $claim): JsonResponse
    {
        $claim->delete();

        return $this->success(null, 'Warranty claim deleted successfully');
    }

    public function byVehicle($vehicleId): JsonResponse
    {
        $claims = WarrantyClaim::where('vehicle_id', $vehicleId)
            ->with(['vehicle.model', 'customer', 'warranty'])
            ->latest()
            ->get();

        return $this->success($claims);
    }
}