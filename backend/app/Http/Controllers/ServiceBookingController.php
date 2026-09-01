<?php

namespace App\Http\Controllers;

use App\Models\ServiceBooking;
use App\Models\ServiceWorkOrder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ServiceBookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ServiceBooking::with(['vehicle.model', 'customer', 'dealer', 'assignedAdvisor']);

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

        if ($request->filled('booking_date')) {
            $query->whereDate('booking_date', $request->booking_date);
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
            'booking_date' => 'required|date',
            'booking_time' => 'nullable|date_format:H:i',
            'service_type' => 'in:ROUTINE,PERIODIC,REPAIR,WARRANTY,INSPECTION,OTHER',
            'complaint' => 'nullable|string',
            'assigned_advisor_id' => 'nullable|exists:users,id',
            'status' => 'in:REQUESTED,CONFIRMED,ARRIVED,IN_PROGRESS,COMPLETED,CANCELLED,NO_SHOW',
        ]);

        $validated['booking_number'] = 'SBK' . str_pad((string)(ServiceBooking::max('id') + 1), 6, '0', STR_PAD_LEFT);

        $booking = ServiceBooking::create($validated);

        return $this->success($booking->load(['vehicle.model', 'customer', 'dealer', 'assignedAdvisor']), 'Service booking created successfully', 201);
    }

    public function show(ServiceBooking $booking): JsonResponse
    {
        $booking->load(['vehicle.model', 'customer', 'dealer', 'assignedAdvisor', 'workOrders.technician']);

        return $this->success($booking);
    }

    public function update(Request $request, ServiceBooking $booking): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'customer_id' => 'nullable|exists:customers,id',
            'dealer_id' => 'nullable|exists:dealers,id',
            'booking_date' => 'required|date',
            'booking_time' => 'nullable|date_format:H:i',
            'service_type' => 'in:ROUTINE,PERIODIC,REPAIR,WARRANTY,INSPECTION,OTHER',
            'complaint' => 'nullable|string',
            'assigned_advisor_id' => 'nullable|exists:users,id',
            'status' => 'in:REQUESTED,CONFIRMED,ARRIVED,IN_PROGRESS,COMPLETED,CANCELLED,NO_SHOW',
        ]);

        $booking->update($validated);

        return $this->success($booking->load(['vehicle.model', 'customer', 'dealer', 'assignedAdvisor']), 'Service booking updated successfully');
    }

    public function destroy(ServiceBooking $booking): JsonResponse
    {
        $booking->delete();

        return $this->success(null, 'Service booking deleted successfully');
    }
}