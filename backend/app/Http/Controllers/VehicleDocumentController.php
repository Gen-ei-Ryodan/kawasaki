<?php

namespace App\Http\Controllers;

use App\Models\VehicleDocument;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VehicleDocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = VehicleDocument::with(['vehicle', 'uploadedBy']);

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->filled('document_type')) {
            $query->where('document_type', $request->document_type);
        }

        $query->latest();

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }
}