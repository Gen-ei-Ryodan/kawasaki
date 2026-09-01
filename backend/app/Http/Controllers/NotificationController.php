<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Notification::where('user_id', $request->user()->id);

        if ($request->filled('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        $query->latest();

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function update(Request $request, Notification $notification): JsonResponse
    {
        $validated = $request->validate([
            'is_read' => 'required|boolean',
        ]);

        $notification->update($validated);

        return $this->success($notification);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return $this->success(['count' => $count]);
    }
}