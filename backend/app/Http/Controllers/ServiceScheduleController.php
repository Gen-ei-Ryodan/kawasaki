<?php

namespace App\Http\Controllers;

use App\Models\ServiceSchedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ServiceScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ServiceSchedule::with('vehicle');

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $query->latest();

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function reminders(Request $request): JsonResponse
    {
        $today = now()->toDateString();
        $schedules = ServiceSchedule::where('status', 'ACTIVE')->get();

        $reminders = [
            'overdue' => [],
            'due' => [],
            'upcoming' => [],
        ];

        foreach ($schedules as $schedule) {
            if (!$schedule->next_service_date) continue;
            $diffDays = \Carbon\Carbon::parse($schedule->next_service_date)->diffInDays(now());
            $item = [
                'id' => $schedule->id,
                'vehicle_id' => $schedule->vehicle_id,
                'service_type' => $schedule->service_type,
                'last_service_date' => $schedule->last_service_date,
                'next_service_date' => $schedule->next_service_date,
                'last_service_km' => $schedule->last_service_km,
                'next_service_km' => $schedule->next_service_km,
                'days_diff' => $diffDays,
            ];

            if ($diffDays < 0) {
                $reminders['overdue'][] = $item;
            } elseif ($diffDays <= 7) {
                $reminders['due'][] = $item;
            } else {
                $reminders['upcoming'][] = $item;
            }
        }

        return $this->success($reminders);
    }
}