<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyAccount;
use App\Models\LoyaltyTransaction;
use App\Models\LoyaltyTier;
use App\Models\LoyaltyRule;
use App\Models\Reward;
use App\Models\RewardRedemption;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class LoyaltyController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $customerId = $request->customer_id ?? $request->user()?->customer?->id;

        if (!$customerId) {
            return $this->error('Customer not found', 404);
        }

        $account = LoyaltyAccount::where('customer_id', $customerId)->with('tier')->first();

        if (!$account) {
            return $this->success([
                'account' => null,
                'balance' => 0,
                'tier' => 'Bronze',
            ]);
        }

        $balance = LoyaltyTransaction::where('customer_id', $customerId)
            ->selectRaw('SUM(CASE WHEN type = "EARN" THEN points ELSE 0 END) - SUM(CASE WHEN type = "REDEEM" THEN points ELSE 0 END) - SUM(CASE WHEN type = "EXPIRED" THEN points ELSE 0 END) + SUM(CASE WHEN type = "ADJUSTMENT" THEN points ELSE 0 END) as balance')
            ->value('balance') ?? 0;

        return $this->success([
            'account' => $account,
            'balance' => (int)$balance,
            'tier' => $account->tier?->name ?? 'Bronze',
        ]);
    }

    public function transactions(Request $request): JsonResponse
    {
        $customerId = $request->customer_id;

        if (!$customerId) {
            return $this->error('Customer ID required', 400);
        }

        $transactions = LoyaltyTransaction::where('customer_id', $customerId)
            ->latest()
            ->paginate($request->per_page ?? 15);

        return $this->success($transactions);
    }

    public function redeem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'reward_id' => 'required|exists:rewards,id',
        ]);

        $reward = Reward::where('id', $validated['reward_id'])->where('status', 'ACTIVE')->first();
        if (!$reward) {
            return $this->error('Reward not available', 404);
        }

        if ($reward->stock <= 0) {
            return $this->error('Reward out of stock', 400);
        }

        $balance = LoyaltyTransaction::where('customer_id', $validated['customer_id'])
            ->selectRaw('SUM(CASE WHEN type = "EARN" THEN points ELSE 0 END) - SUM(CASE WHEN type = "REDEEM" THEN points ELSE 0 END) - SUM(CASE WHEN type = "EXPIRED" THEN points ELSE 0 END) + SUM(CASE WHEN type = "ADJUSTMENT" THEN points ELSE 0 END) as balance')
            ->value('balance') ?? 0;

        if ($balance < $reward->points_required) {
            return $this->error('Insufficient points', 400);
        }

        DB::transaction(function () use ($validated, $reward) {
            LoyaltyTransaction::create([
                'customer_id' => $validated['customer_id'],
                'type' => 'REDEEM',
                'points' => $reward->points_required,
                'reference_type' => Reward::class,
                'reference_id' => $reward->id,
                'description' => "Redeemed reward: {$reward->name}",
            ]);

            $redemption = RewardRedemption::create([
                'redemption_number' => 'RDM' . str_pad((string)(RewardRedemption::max('id') + 1), 6, '0', STR_PAD_LEFT),
                'customer_id' => $validated['customer_id'],
                'reward_id' => $reward->id,
                'points_used' => $reward->points_required,
                'status' => 'PENDING',
                'redeemed_at' => now(),
            ]);

            $reward->decrement('stock');

            Voucher::create([
                'code' => 'VCH' . str_pad((string)(Voucher::max('id') + 1), 6, '0', STR_PAD_LEFT) . rand(100, 999),
                'customer_id' => $validated['customer_id'],
                'reward_id' => $reward->id,
                'value' => 0,
                'status' => 'ACTIVE',
                'valid_until' => now()->addDays(30)->toDateString(),
            ]);
        });

        return $this->success(null, 'Reward redeemed successfully');
    }

    public function rewards(Request $request): JsonResponse
    {
        $query = Reward::where('status', 'ACTIVE');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orwhere('name', 'like', "%{$search}%");
            });
        }

        $query->latest();

        return $this->success($this->paginate($query, $request->per_page ?? 15));
    }

    public function tiers(Request $request): JsonResponse
    {
        $tiers = LoyaltyTier::where('status', 'ACTIVE')->orderBy('minimum_points')->get();

        return $this->success($tiers);
    }
}