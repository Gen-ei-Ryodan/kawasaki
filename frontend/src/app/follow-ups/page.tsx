'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { FollowUp } from '@/types';

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  const loadFollowUps = async () => {
    try {
      let url = '/follow-ups';
      if (tab === 'today') url = '/follow-ups/today';
      else if (tab === 'overdue') url = '/follow-ups/overdue';
      else if (tab === 'upcoming') url = '/follow-ups/upcoming';
      
      const response = await api.get(url, { params: { per_page: 50 } });
      setFollowUps(response.data.data.data || response.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFollowUps(); }, [tab]);

  const handleComplete = async (id: number) => {
    try { await api.put(`/follow-ups/${id}/complete`, {}); loadFollowUps(); } catch (err) { console.error(err); }
  };

  const statusColors: Record<string, string> = {
    PLANNED: 'bg-blue-100 text-blue-800', COMPLETED: 'bg-green-100 text-green-800',
    MISSED: 'bg-red-100 text-red-800', CANCELLED: 'bg-gray-100 text-gray-800',
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Follow-Up Management</h1>
      
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'All' },
          { key: 'today', label: "Today's" },
          { key: 'overdue', label: 'Overdue' },
          { key: 'upcoming', label: 'Upcoming' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); }}
            className={`px-4 py-2 rounded-md text-sm ${tab === t.key ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salesperson</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {followUps.map(fu => (
                <tr key={fu.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{fu.follow_up_date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{fu.channel || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{fu.purpose || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">ID:{fu.salesperson_id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[fu.status]}`}>{fu.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    {fu.status === 'PLANNED' && (
                      <button onClick={() => handleComplete(fu.id)} className="text-green-600 hover:text-green-900">Complete</button>
                    )}
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