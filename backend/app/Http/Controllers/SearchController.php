<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\Vehicle;
use App\Models\SalesTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $query = $request->q;

        if (!$query || strlen($query) < 2) {
            return $this->error('Search query must be at least 2 characters', 400);
        }

        $results = [
            'customers' => [],
            'leads' => [],
            'vehicles' => [],
            'transactions' => [],
        ];

        // Search customers
        $customers = Customer::where(function ($q) use ($query) {
            $q->where('customer_code', 'like', "%{$query}%")
              ->orwhere('full_name', 'like', "%{$query}%")
              ->orwhere('phone', 'like', "%{$query}%")
              ->orwhere('email', 'like', "%{$query}%")
              ->orwhere('nik', 'like', "%{$query}%");
        })->limit(5)->get();

        $results['customers'] = $customers->map(fn($c) => [
            'type' => 'customer',
            'id' => $c->id,
            'code' => $c->customer_code,
            'name' => $c->full_name,
            'phone' => $c->phone,
            'status' => $c->status,
        ]);

        // Search leads
        $leads = Lead::where(function ($q) use ($query) {
            $q->where('lead_code', 'like', "%{$query}%")
              ->orwhere('name', 'like', "%{$query}%")
              ->orwhere('phone', 'like', "%{$query}%");
        })->limit(5)->get();

        $results['leads'] = $leads->map(fn($l) => [
            'type' => 'lead',
            'id' => $l->id,
            'code' => $l->lead_code,
            'name' => $l->name,
            'phone' => $l->phone,
            'status' => $l->status,
        ]);

        // Search vehicles
        $vehicles = Vehicle::where(function ($q) use ($query) {
            $q->where('vehicle_code', 'like', "%{$query}%")
              ->orwhere('vin', 'like', "%{$query}%")
              ->orwhere('engine_number', 'like', "%{$query}%")
              ->orwhere('license_plate', 'like', "%{$query}%")
              ->orwhere('color', 'like', "%{$query}%");
        })->limit(5)->get();

        $results['vehicles'] = $vehicles->map(fn($v) => [
            'type' => 'vehicle',
            'id' => $v->id,
            'code' => $v->vehicle_code,
            'vin' => $v->vin,
            'license_plate' => $v->license_plate,
            'status' => $v->status,
        ]);

        // Search transactions
        $transactions = SalesTransaction::where(function ($q) use ($query) {
            $q->where('transaction_number', 'like', "%{$query}%");
        })->limit(5)->get();

        $results['transactions'] = $transactions->map(fn($t) => [
            'type' => 'transaction',
            'id' => $t->id,
            'code' => $t->transaction_number,
            'status' => $t->status,
            'final_price' => $t->final_price,
        ]);

        return $this->success($results);
    }
}