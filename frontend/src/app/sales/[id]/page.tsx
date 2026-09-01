'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { SalesTransaction } from '@/types';

export default function SaleDetailPage() {
  const [sale, setSale] = useState<SalesTransaction | any>(null);
  const [loading, setLoading] = useState(true);
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/sales/${id}`);
        setSale(response.data.data);
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
          <h1 className="text-2xl font-bold text-gray-800">Sale Detail</h1>
          <p className="text-gray-600 text-sm">{sale?.transaction_number}</p>
        </div>
        {sale?.status !== 'SOLD' && sale?.status !== 'CANCELLED' && (
          <button
            onClick={async () => { await api.put(`/sales/${id}/complete`, {}); window.location.reload(); }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Complete Sale
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Customer:</span> <span className="font-medium text-gray-800">{sale?.customer?.full_name || '-'}</span></div>
          <div><span className="text-gray-500">Salesperson:</span> <span className="font-medium text-gray-800">{sale?.salesperson?.name || '-'}</span></div>
          <div><span className="text-gray-500">Vehicle:</span> <span className="font-medium text-gray-800">{sale?.vehicle?.vin || '-'}</span></div>
          <div><span className="text-gray-500">Sale Date:</span> <span className="font-medium text-gray-800">{sale?.sale_date || '-'}</span></div>
          <div><span className="text-gray-500">Vehicle Price:</span> <span className="font-medium text-gray-800">Rp{sale?.vehicle_price?.toLocaleString('id-ID')}</span></div>
          <div><span className="text-gray-500">Discount:</span> <span className="font-medium text-gray-800">Rp{sale?.discount?.toLocaleString('id-ID')}</span></div>
          <div><span className="text-gray-500">Final Price:</span> <span className="font-medium text-gray-800">Rp{sale?.final_price?.toLocaleString('id-ID')}</span></div>
          <div><span className="text-gray-500">Payment:</span> <span className="font-medium text-gray-800">{sale?.payment_method} / {sale?.payment_status}</span></div>
          <div><span className="text-gray-500">Status:</span> <span className="font-medium text-gray-800">{sale?.status}</span></div>
        </div>
      </div>
    </Layout>
  );
}