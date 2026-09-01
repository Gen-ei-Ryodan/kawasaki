'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { Vehicle } from '@/types';

export default function ServiceRemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  const loadReminders = async () => {
    try {
      let url = '/services/schedules';
      const response = await api.get(url, { params: { per_page: 50 } });
      const schedules = response.data.data.data || [];
      const today = new Date().getTime();
      const upcoming: any[] = [];
      const due: any[] = [];
      const overdue: any[] = [];

      schedules.forEach((s: any) => {
        if (!s.next_service_date) return;
        const nextDate = new Date(s.next_service_date).getTime();
        const diffDays = Math.round((nextDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) overdue.push({ ...s, daysDiff: diffDays });
        else if (diffDays <= 7) due.push({ ...s, daysDiff: diffDays });
        else upcoming.push({ ...s, daysDiff: diffDays });
      });

      if (tab === 'overdue') setReminders(overdue);
      else if (tab === 'due') setReminders(due);
      else if (tab === 'upcoming') setReminders(upcoming);
      else setReminders([...overdue, ...due, ...upcoming]);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReminders(); }, [tab]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Service Reminders</h1>
      
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'All', count: 'all' },
          { key: 'overdue', label: 'Overdue', count: 'overdue' },
          { key: 'due', label: 'Due (7 days)', count: 'due' },
          { key: 'upcoming', label: 'Upcoming', count: 'upcoming' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last KM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next KM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reminders.map((r: any) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Vehicle ID:{r.vehicle_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.service_type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.last_service_date || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.next_service_date || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.last_service_km || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.next_service_km || '-'}</td>
                  <td className="px-6 py-4">
<span className={`px-2 py-1 rounded-full text-xs ${
                    (r.daysDiff as number) < 0 ? 'bg-red-100 text-red-800' :
                    (r.daysDiff as number) <= 3 ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {(r.daysDiff as number) < 0 ? Math.abs(r.daysDiff as number) + ' days overdue' : r.daysDiff + ' days'}
                  </span>
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