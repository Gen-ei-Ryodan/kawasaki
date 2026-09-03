'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [funnel, setFunnel] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const [customers, leads, vehicles, sales, funnelRes] = await Promise.all([
        api.get('/customers?per_page=1'),
        api.get('/leads?per_page=1'),
        api.get('/vehicles?per_page=1'),
        api.get('/sales?per_page=1'),
        api.get('/reports/sales-funnel'),
      ]);

      setStats({
        total_customers: customers.data.data.total,
        total_leads: leads.data.data.total,
        total_vehicles: vehicles.data.data.total,
        total_sales: sales.data.data.total,
      });
      setFunnel(funnelRes.data.data);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total_customers || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Leads</p>
              <p className="text-3xl font-bold text-orange-600">{stats.total_leads || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Vehicles</p>
              <p className="text-3xl font-bold text-green-600">{stats.total_vehicles || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-3xl font-bold text-purple-600">{stats.total_sales || 0}</p>
            </div>
          </div>

          {funnel && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel</h2>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
                {['total_leads', 'cold', 'warm', 'hot', 'hold', 'won', 'lost'].map(key => (
                  <div key={key} className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{funnel[key] || 0}</p>
                    <p className="text-xs text-gray-500 capitalize">{key.replace('_', ' ')}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t text-center">
                <span className="text-lg font-semibold">Conversion Rate: </span>
                <span className="text-xl font-bold text-red-600">{funnel.conversion_rate || 0}%</span>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}