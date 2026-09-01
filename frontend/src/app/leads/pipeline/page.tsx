'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { Lead } from '@/types';

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadPipeline = async () => {
    try {
      const response = await api.get('/leads/pipeline');
      setPipeline(response.data.data);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPipeline(); }, []);

  const handleDrop = async (leadId: number, newStatus: string) => {
    try {
      await api.put(`/leads/${leadId}/status`, { status: newStatus });
      loadPipeline();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to change status');
    }
  };

  const columns = [
    { key: 'COLD', label: 'Cold', color: 'bg-blue-500' },
    { key: 'WARM', label: 'Warm', color: 'bg-yellow-500' },
    { key: 'HOT', label: 'Hot', color: 'bg-red-500' },
    { key: 'HOLD', label: 'Hold', color: 'bg-gray-500' },
    { key: 'WON', label: 'Won', color: 'bg-green-500' },
    { key: 'LOST', label: 'Lost', color: 'bg-gray-400' },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales Pipeline</h1>
      
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-6 gap-4 mb-6">
            {columns.map(col => (
              <div key={col.key} className="bg-white p-4 rounded-lg shadow text-center">
                <div className={`w-3 h-3 rounded-full ${col.color} mx-auto mb-2`}></div>
                <p className="text-2xl font-bold text-gray-800">{pipeline?.counts?.[col.key] || 0}</p>
                <p className="text-xs text-gray-500">{col.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {columns.map(col => (
              <div key={col.key} className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-sm mb-3 text-gray-700">{col.label}</h3>
                <div className="space-y-2">
                  {(pipeline?.[col.key] || []).map((lead: Lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('leadId', String(lead.id))}
                      className="bg-white p-3 rounded shadow-sm cursor-move"
                    >
                      <p className="text-sm font-medium text-gray-800">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.lead_code}</p>
                      <p className="text-xs text-gray-500">{lead.phone || '-'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}