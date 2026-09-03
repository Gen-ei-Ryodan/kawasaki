<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\VehicleModel;
use App\Models\VehicleOwnership;
use App\Models\VehicleTimeline;
use App\Models\ServiceRecord;
use App\Models\Warranty;
use App\Models\WarrantyClaim;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class VehicleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Vehicle::with(['model', 'dealer']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('vehicle_code', 'like', "%{$search}%")
                  ->orwhere('vin', 'like', "%{$search}%")
                  ->orwhere('engine_number', 'like', "%{$search}%")
                  ->orwhere('license_plate', 'like', "%{$search}%")
                  ->orwhere('color', 'like', "%{$search}%");
            });
        }

        if ($request->filled('vehicle_model_id')) {
            $query->where('vehicle_model_id', $request->vehicle_model_id);
        }

        if ($request->filled('dealer_id')) {
            $query->where('dealer_id', $request->dealer_id);
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
            'vehicle_model_id' => 'required|exists:vehicle_models,id',
            'vin' => 'required|string|max:50',
            'engine_number' => 'required|string|max:50',
            'color' => 'nullable|string|max:50',
            'year' => 'nullable|integer',
            'license_plate' => 'nullable|string|max:20',
            'odometer' => 'nullable|integer',
            'dealer_id' => 'nullable|exists:dealers,id',
            'status' => 'in:IN_STOCK,BOOKED,SOLD,DELIVERED,IN_SERVICE,TRANSFERRED,SCRAPPED',
        ]);

        $validated['vehicle_code'] = 'VEH' . str_pad((string)(Vehicle::max('id') + 1), 6, '0', STR_PAD_LEFT);
        $validated['created_by'] = Auth::id();

        $vehicle = Vehicle::create($validated);

        return $this->success($vehicle->load(['model', 'dealer']), 'Vehicle created successfully', 201);
    }

    public function show(Vehicle $vehicle): JsonResponse
    {
        $vehicle->load([
            'model',
            'dealer',
            'currentOwner.customer',
            'currentOwner.salesperson',
            'ownerships' => fn($q) => $q->latest()->limit(10),
        ]);

        return $this->success($vehicle);
    }

    public function update(Request $request, Vehicle $vehicle): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_model_id' => 'required|exists:vehicle_models,id',
            'vin' => 'required|string|max:50',
            'engine_number' => 'required|string|max:50',
            'color' => 'nullable|string|max:50',
            'year' => 'nullable|integer',
            'license_plate' => 'nullable|string|max:20',
            'odometer' => 'nullable|integer',
            'dealer_id' => 'nullable|exists:dealers,id',
            'status' => 'in:IN_STOCK,BOOKED,SOLD,DELIVERED,IN_SERVICE,TRANSFERRED,SCRAPPED',
        ]);

        $vehicle->update($validated);

        return $this->success($vehicle->load(['model', 'dealer']), 'Vehicle updated successfully');
    }

    public function destroy(Vehicle $vehicle): JsonResponse
    {
        // Delete service items through service records
        $vehicle->serviceRecords()->each(function ($record) {
            $record->items()->delete();
            $record->warrantyClaims()->delete();
        });
        $vehicle->warrantyClaims()->delete();
        $vehicle->serviceWorkOrders()->delete();
        $vehicle->serviceRecords()->delete();
        $vehicle->serviceBookings()->delete();
        $vehicle->serviceSchedules()->delete();
        $vehicle->documents()->delete();
        $vehicle->registrations()->delete();
        $vehicle->timelines()->delete();
        $vehicle->ownershipTransfers()->delete();
        $vehicle->ownerships()->delete();
        $vehicle->warranties()->delete();
        $vehicle->salesTransactions()->update(['vehicle_id' => null]);
        $vehicle->delete();

        return $this->success(null, 'Vehicle deleted successfully');
    }

    public function vehicle360(Vehicle $vehicle): JsonResponse
    {
        $vehicle->load([
            'model',
            'dealer',
            'currentOwner.customer',
            'currentOwner.salesperson',
            'ownerships' => fn($q) => $q->latest()->limit(10),
            'timelines' => fn($q) => $q->latest()->limit(20),
            'documents' => fn($q) => $q->latest()->limit(10),
            'registrations' => fn($q) => $q->latest()->limit(5),
        ]);

        $vehicle->stats = [
            'total_services' => ServiceRecord::where('vehicle_id', $vehicle->id)->count(),
            'total_service_cost' => ServiceRecord::where('vehicle_id', $vehicle->id)->sum('total_cost'),
            'last_service' => ServiceRecord::where('vehicle_id', $vehicle->id)->latest()->first(),
            'next_service' => \App\Models\ServiceSchedule::where('vehicle_id', $vehicle->id)->where('status', 'ACTIVE')->first(),
            'warranty' => Warranty::where('vehicle_id', $vehicle->id)->where('status', 'ACTIVE')->first(),
            'warranty_claims' => WarrantyClaim::where('vehicle_id', $vehicle->id)->count(),
            'ownership_history' => $vehicle->ownerships->count(),
        ];

        return $this->success($vehicle);
    }

    public function timeline(Vehicle $vehicle): JsonResponse
    {
        $timelines = $vehicle->timelines()
            ->with('createdBy')
            ->latest()
            ->paginate($request->per_page ?? 20);

        return $this->success($timelines);
    }

    public function services(Vehicle $vehicle): JsonResponse
    {
        $services = $vehicle->serviceRecords()
            ->with(['customer', 'dealer'])
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($services);
    }

    public function warranty(Vehicle $vehicle): JsonResponse
    {
        $warranty = Warranty::where('vehicle_id', $vehicle->id)
            ->where('status', 'ACTIVE')
            ->first();

        $claims = WarrantyClaim::where('vehicle_id', $vehicle->id)
            ->latest()
            ->get();

        return $this->success([
            'warranty' => $warranty,
            'claims' => $claims,
            'total_claims' => $claims->count(),
        ]);
    }

    public function ownership(Vehicle $vehicle): JsonResponse
    {
        $ownership = $vehicle->currentOwner;
        $history = $vehicle->ownerships()
            ->with(['customer', 'salesperson', 'dealer'])
            ->latest()
            ->get();

        return $this->success([
            'current_owner' => $ownership,
            'history' => $history,
        ]);
    }

    public function transferOwnership(Request $request, Vehicle $vehicle): JsonResponse
    {
        $validated = $request->validate([
            'to_customer_id' => 'required|exists:customers,id',
            'transfer_date' => 'required|date',
            'reason' => 'nullable|string',
            'document_reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($vehicle, $validated) {
            // End current ownership
            $currentOwnership = $vehicle->ownerships()->where('status', 'CURRENT')->first();
            if ($currentOwnership) {
                $currentOwnership->update([
                    'status' => 'ENDED',
                    'ownership_end' => now(),
                ]);
            }

            // Create new ownership
            VehicleOwnership::create([
                'vehicle_id' => $vehicle->id,
                'customer_id' => $validated['to_customer_id'],
                'ownership_start' => $validated['transfer_date'],
                'status' => 'CURRENT',
            ]);

            // Create transfer record
            \App\Models\OwnershipTransfer::create([
                'vehicle_id' => $vehicle->id,
                'from_customer_id' => $currentOwnership?->customer_id,
                'to_customer_id' => $validated['to_customer_id'],
                'transfer_date' => $validated['transfer_date'],
                'reason' => $validated['reason'] ?? null,
                'document_reference' => $validated['document_reference'] ?? null,
                'approved_by' => Auth::id(),
                'notes' => $validated['notes'] ?? null,
            ]);

            // Update vehicle status
            $vehicle->update(['status' => 'TRANSFERRED']);

            // Create timeline event
            VehicleTimeline::create([
                'vehicle_id' => $vehicle->id,
                'event_type' => 'OWNERSHIP_TRANSFER',
                'event_date' => $validated['transfer_date'],
                'title' => 'Ownership Transfer',
                'description' => "Ownership transferred to customer {$validated['to_customer_id']}",
                'created_by' => Auth::id(),
            ]);
        });

        $vehicle->load(['currentOwner.customer', 'ownerships.customer']);

        return $this->success($vehicle, 'Ownership transferred successfully');
    }
}