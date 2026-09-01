'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVouchers = async () => {
    try {
      const response = await api.get('/loyalty/rewards', { params: { per_page: 50 } });
      setVouchers(response.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVouchers(); }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Rewards & Vouchers</h1>
      <p className="text-gray-600 text-sm mb-6">Manage loyalty rewards and voucher stock</p>
      
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.map((r: any) => (
            <div key={r.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800">{r.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${r.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {r.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Code: {r.code}</p>
              <p className="text-sm text-gray-500 mb-1">Points: {r.points_required}</p>
              <p className="text-sm text-gray-500 mb-3">Stock: {r.stock}</p>
              {r.description && <p className="text-sm text-gray-600 mb-3">{r.description}</p>}
              <button
                onClick={async () => {
                  const customerId = prompt('Enter Customer ID:');
                  if (customerId) {
                    try {
                      await api.post('/loyalty/redeem', { customer_id: Number(customerId), reward_id: r.id });
                      alert('Redeemed!');
                    } catch (err: any) {
                      alert(err.response?.data?.message);
                    }
                  }
                }}
                disabled={r.stock <= 0}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                {r.stock > 0 ? 'Redeem' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}