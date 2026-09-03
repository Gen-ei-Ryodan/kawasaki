'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { Customer, Vehicle, SalesTransaction } from '@/types';

export default function CustomerDetailPage() {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/customers/${id}/360`);
        setCustomer(response.data.data);
      } catch (err) {
        console.error('Failed to load:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <Layout><div className="text-center py-10">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer 360</h1>
          <p className="text-gray-600 text-sm">{customer?.full_name} - {customer?.customer_code}</p>
        </div>
        <button
          onClick={() => { window.location.href = "/customers/" + id + "/edit"; }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Vehicles</p>
          <p className="text-3xl font-bold text-blue-600">{customer?.stats?.total_vehicles || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Purchases</p>
          <p className="text-3xl font-bold text-green-600">{customer?.stats?.total_purchases || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Services</p>
          <p className="text-3xl font-bold text-orange-600">{customer?.stats?.total_services || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Loyalty Points</p>
          <p className="text-3xl font-bold text-purple-600">{customer?.stats?.loyalty_points || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicles</h2>
          <div className="space-y-2">
            {customer?.vehicles?.map((v: Vehicle) => (
              <div key={v.id} className="p-3 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">{v.model?.brand} {v.model?.model}</p>
                <p className="text-sm text-gray-500">{v.vin} - {v.color}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h2>
          <div className="space-y-2">
            {customer?.salesTransactions?.slice(0, 5).map((s: SalesTransaction) => (
              <div key={s.id} className="p-3 bg-gray-50 rounded">
                <p className="font-medium text-gray-800">{s.transaction_number}</p>
                <p className="text-sm text-gray-500">Rp{s.final_price.toLocaleString('id-ID')} - {s.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}