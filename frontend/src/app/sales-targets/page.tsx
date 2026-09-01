'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { SalesTarget, Salesperson, Dealer } from '@/types';

export default function SalesTargetsPage() {
  const [targets, setTargets] = useState<SalesTarget[]>([]);
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [tRes, sRes, dRes] = await Promise.all([
        api.get('/sales-targets', { params: { per_page: 50 } }),
        api.get('/salespersons', { params: { per_page: 100 } }),
        api.get('/dealers', { params: { per_page: 100 } }),
      ]);
      setTargets(tRes.data.data.data || []);
      setSalespersons(sRes.data.data.data || []);
      setDealers(dRes.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this target?')) return;
    try { await api.delete(`/sales-targets/${id}`); loadData(); } catch (err) { console.error(err); }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sales Targets</h1>
          <p className="text-gray-600 text-sm">Manage sales targets and achievements</p>
        </div>
        <button
          onClick={() => { window.location.href = '/sales-targets/create'; }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          + New Target
        </button>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salesperson</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Units</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {targets.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {salespersons.find(s => s.id === t.salesperson_id)?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{t.period}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{t.target_units}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Rp{t.target_revenue.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${t.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => { window.location.href = "/sales-targets/" + t.id; }} className="text-blue-600 hover:text-blue-900">View</button>
                    <button onClick={() => { window.location.href = "/sales-targets/" + t.id + "/edit"; }} className="text-yellow-600 hover:text-yellow-900">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}