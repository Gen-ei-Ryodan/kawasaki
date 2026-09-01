<?php

namespace App\Http\Controllers;

use App\Models\ServiceRecord;
use App\Models\ServiceItem;
use App\Models\VehicleTimeline;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ServiceRecord::with(['vehicle.model', 'customer', 'dealer']);

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('dealer_id')) {
            $query->where('dealer_id', $request->dealer_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('service_type')) {
            $query->where('service_type', $request->service_type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('service_number', 'like', "%{$search}%")
                  ->orwhereHas('vehicle', fn($vq) => $vq->where('vin', 'like', "%{$search}%")->orWhere('license_plate', 'like', "%{$search}%"));
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
            'dealer_id' => 'nullable|exists:dealers,id',
            'service_date' => 'required|date',
            'odometer' => 'nullable|integer',
            'service_type' => 'in:ROUTINE,PERIODIC,REPAIR,WARRANTY,INSPECTION,OTHER',
            'complaint' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'notes' => 'nullable|string',
            'total_cost' => 'nullable|numeric',
            'status' => 'in:PENDING,IN_PROGRESS,COMPLETED,CANCELLED',
            'items' => 'nullable|array',
            'items.*.item_type' => 'in:PART,LABOR,OTHER',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'nullable|integer',
            'items.*.unit_price' => 'nullable|numeric',
        ]);

        $validated['service_number'] = 'SRV' . str_pad((string)(ServiceRecord::max('id') + 1), 6, '0', STR_PAD_LEFT);

        $service = ServiceRecord::create($validated);

        if (!empty($validated['items'])) {
            foreach ($validated['items'] as $item) {
                $quantity = $item['quantity'] ?? 1;
                $unitPrice = $item['unit_price'] ?? 0;
                ServiceItem::create([
                    'service_record_id' => $service->id,
                    'item_type' => $item['item_type'],
                    'name' => $item['name'],
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total' => $quantity * $unitPrice,
                ]);
            }
        }

        // Create timeline event
        VehicleTimeline::create([
            'vehicle_id' => $service->vehicle_id,
            'event_type' => 'SERVICE',
            'event_date' => $service->service_date,
            'title' => 'Service: ' . $service->service_type,
            'description' => $service->complaint,
            'reference_type' => ServiceRecord::class,
            'reference_id' => $service->id,
            'created_by' => Auth::id(),
        ]);

        $service->load(['vehicle.model', 'customer', 'dealer', 'items']);

        return $this->success($service, 'Service record created successfully', 201);
    }

    public function show(ServiceRecord $service): JsonResponse
    {
        $service->load(['vehicle.model', 'customer', 'dealer', 'items']);

        return $this->success($service);
    }

    public function update(Request $request, ServiceRecord $service): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'customer_id' => 'nullable|exists:customers,id',
            'dealer_id' => 'nullable|exists:dealers,id',
            'service_date' => 'required|date',
            'odometer' => 'nullable|integer',
            'service_type' => 'in:ROUTINE,PERIODIC,REPAIR,WARRANTY,INSPECTION,OTHER',
            'complaint' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'notes' => 'nullable|string',
            'total_cost' => 'nullable|numeric',
            'status' => 'in:PENDING,IN_PROGRESS,COMPLETED,CANCELLED',
        ]);

        $service->update($validated);

        return $this->success($service->load(['vehicle.model', 'customer', 'dealer', 'items']), 'Service record updated successfully');
    }

    public function destroy(ServiceRecord $service): JsonResponse
    {
        $service->delete();

        return $this->success(null, 'Service record deleted successfully');
    }
}