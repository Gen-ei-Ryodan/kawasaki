'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Layout from '@/components/Layout';

interface DashboardStats {
  total_customers: number;
  total_leads: number;
  won_leads: number;
  total_vehicles: number;
  conversion_rate: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        // Load basic stats from various endpoints
        const [customers, leads, vehicles] = await Promise.all([
          api.get('/customers?per_page=1'),
          api.get('/leads?per_page=1'),
          api.get('/vehicles?per_page=1'),
        ]);

        setStats({
          total_customers: customers.data.data.total,
          total_leads: leads.data.data.total,
          won_leads: 0,
          total_vehicles: vehicles.data.data.total,
          conversion_rate: 0,
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
        
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.total_customers ?? 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-3xl font-bold text-orange-600">{stats?.total_leads ?? 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Vehicles</p>
                <p className="text-3xl font-bold text-green-600">{stats?.total_vehicles ?? 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-3xl font-bold text-purple-600">{stats?.conversion_rate ?? 0}%</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Welcome, {user?.name}!</h2>
              <p className="text-gray-600">
                Use the sidebar to navigate through the Dealer Management System.
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}