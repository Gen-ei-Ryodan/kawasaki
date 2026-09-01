'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { Warranty } from '@/types';

export default function WarrantyDetailPage() {
  const [warranty, setWarranty] = useState<Warranty | any>(null);
  const [loading, setLoading] = useState(true);
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/warranties/${id}`);
        setWarranty(response.data.data);
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
          <h1 className="text-2xl font-bold text-gray-800">Warranty Detail</h1>
          <p className="text-gray-600 text-sm">{warranty?.warranty_number}</p>
        </div>
        <button
          onClick={() => { window.location.href = "/warranties/" + id + "/edit"; }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          Edit
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Vehicle:</span> <span className="font-medium text-gray-800">{warranty?.vehicle?.vin || '-'}</span></div>
          <div><span className="text-gray-500">Customer:</span> <span className="font-medium text-gray-800">{warranty?.customer?.full_name || '-'}</span></div>
          <div><span className="text-gray-500">Start Date:</span> <span className="font-medium text-gray-800">{warranty?.start_date}</span></div>
          <div><span className="text-gray-500">End Date:</span> <span className="font-medium text-gray-800">{warranty?.end_date}</span></div>
          <div><span className="text-gray-500">Period:</span> <span className="font-medium text-gray-800">{warranty?.warranty_period} months</span></div>
          <div><span className="text-gray-500">Status:</span> <span className="font-medium text-gray-800">{warranty?.status}</span></div>
        </div>
      </div>
    </Layout>
  );
}