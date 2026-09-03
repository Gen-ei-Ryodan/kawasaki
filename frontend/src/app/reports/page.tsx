'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';

export default function ReportsPage() {
  const [funnel, setFunnel] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      const [fRes, rRes] = await Promise.all([
        api.get('/reports/sales-funnel'),
        api.get('/reports/salesperson-ranking'),
      ]);
      setFunnel(fRes.data.data);
      setRanking(rRes.data.data);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReports(); }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>
      
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel</h2>
            {funnel && (
              <div className="space-y-3">
                {Object.entries(funnel).filter(([k]) => k !== 'conversion_rate' && k !== 'warm_rate' && k !== 'hot_rate').map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{key}</span>
                    <span className="font-semibold text-gray-800">{value as number}</span>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Conversion Rate</span>
                    <span className="text-xl font-bold text-red-600">{funnel.conversion_rate}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Salesperson Ranking</h2>
            <div className="space-y-3">
              {ranking.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      r.rank === 1 ? 'bg-yellow-400' : r.rank === 2 ? 'bg-gray-400' : 'bg-orange-300'
                    } text-white`}>
                      {r.rank}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.units_sold} units</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">Rp{r.revenue.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-gray-500">{r.conversion_rate}% conv.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}