'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { LoyaltyTier, Reward } from '@/types';

export default function LoyaltyPage() {
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState('');

  const loadLoyalty = async () => {
    try {
      const [tRes, rRes] = await Promise.all([
        api.get('/loyalty/tiers'),
        api.get('/loyalty/rewards', { params: { per_page: 50 } }),
      ]);
      setTiers(tRes.data.data);
      setRewards(rRes.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLoyalty(); }, []);

  const handleRedeem = async (rewardId: number) => {
    if (!customerId) {
      alert('Please enter Customer ID');
      return;
    }
    try {
      await api.post('/loyalty/redeem', { customer_id: Number(customerId), reward_id: rewardId });
      alert('Reward redeemed successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to redeem');
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Loyalty Program</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Membership Tiers</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-3">
              {tiers.map(tier => (
                <div key={tier.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">{tier.name}</h3>
                    <span className="text-sm text-gray-500">{tier.minimum_points}+ points</span>
                  </div>
                  {tier.benefits && <p className="text-sm text-gray-600 mt-1">{tier.benefits}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Rewards</h2>
          <div className="mb-4">
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Customer ID (for redemption)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
            />
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-3">
              {rewards.map(r => (
                <div key={r.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{r.name}</h3>
                    <p className="text-sm text-gray-500">{r.code} - {r.points_required} points</p>
                  </div>
                  <button
                    onClick={() => handleRedeem(r.id)}
                    disabled={r.stock <= 0}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    {r.stock > 0 ? 'Redeem' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}