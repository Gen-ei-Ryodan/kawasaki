<?php

namespace App\Http\Controllers;

use App\Models\VehicleModel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VehicleModelController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = VehicleModel::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                  ->orwhere('model', 'like', "%{$search}%")
                  ->orwhere('variant', 'like', "%{$search}%");
            });
        }

        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $query->orderBy('brand')->orderBy('model');

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:50',
            'model' => 'required|string|max:100',
            'variant' => 'nullable|string|max:100',
            'year' => 'nullable|integer',
            'engine_cc' => 'nullable|integer',
            'description' => 'nullable|string',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        $vm = VehicleModel::create($validated);

        return $this->success($vm, 'Vehicle model created successfully', 201);
    }

    public function show(VehicleModel $vm): JsonResponse
    {
        return $this->success($vm);
    }

    public function update(Request $request, VehicleModel $vm): JsonResponse
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:50',
            'model' => 'required|string|max:100',
            'variant' => 'nullable|string|max:100',
            'year' => 'nullable|integer',
            'engine_cc' => 'nullable|integer',
            'description' => 'nullable|string',
            'status' => 'in:ACTIVE,INACTIVE',
        ]);

        $vm->update($validated);

        return $this->success($vm, 'Vehicle model updated successfully');
    }

    public function destroy(VehicleModel $vm): JsonResponse
    {
        $vm->delete();

        return $this->success(null, 'Vehicle model deleted successfully');
    }
}