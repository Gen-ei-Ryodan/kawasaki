'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const response = await api.get('/notifications', { params: { per_page: 50 } });
      setNotifications(response.data.data.data || response.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const markRead = async (id: number) => {
    try {
      await api.put('/notifications/' + id, { is_read: true });
      loadNotifications();
    } catch (err) { console.error(err); }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>
      
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          No notifications
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((n: any) => (
                <tr key={n.id} className={`hover:bg-gray-50 ${!n.is_read ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 text-sm text-gray-500">{n.type}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{n.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{n.message || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{n.created_at || '-'}</td>
                  <td className="px-6 py-4">
                    {n.is_read ? (
                      <span className="text-xs text-green-600">Read</span>
                    ) : (
                      <button onClick={() => markRead(n.id)} className="text-xs text-red-600 hover:text-red-900">
                        Mark Read
                      </button>
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