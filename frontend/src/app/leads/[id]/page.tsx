'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { Lead } from '@/types';

export default function LeadDetailPage() {
  const [lead, setLead] = useState<Lead | any>(null);
  const [loading, setLoading] = useState(true);
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/leads/${id}`);
        setLead(response.data.data);
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
          <h1 className="text-2xl font-bold text-gray-800">Lead Detail</h1>
          <p className="text-gray-600 text-sm">{lead?.lead_code} - {lead?.name}</p>
        </div>
        <button
          onClick={() => { window.location.href = "/leads/" + id + "/edit"; }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Lead Information</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-800">{lead?.name}</span></div>
            <div><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-800">{lead?.phone || '-'}</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-800">{lead?.email || '-'}</span></div>
            <div><span className="text-gray-500">Source:</span> <span className="font-medium text-gray-800">{lead?.source || '-'}</span></div>
            <div><span className="text-gray-500">Status:</span> <span className="font-medium text-gray-800">{lead?.status}</span></div>
            <div><span className="text-gray-500">Budget:</span> <span className="font-medium text-gray-800">{lead?.estimated_budget || '-'}</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Status History</h2>
          <div className="space-y-2">
            {lead?.statusHistories?.map((h: any) => (
              <div key={h.id} className="p-3 bg-gray-50 rounded text-sm">
                <p>{h.old_status} → {h.new_status}</p>
                {h.reason && <p className="text-gray-500 text-xs">{h.reason}</p>}
                <p className="text-gray-400 text-xs">{h.created_at}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}