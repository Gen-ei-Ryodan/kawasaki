'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { Salesperson } from '@/types';

export default function SalespersonDetailPage() {
  const [sp, setSp] = useState<Salesperson | any>(null);
  const [achievement, setAchievement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  useEffect(() => {
    async function load() {
      try {
        const [spRes, achRes] = await Promise.all([
          api.get(`/salespersons/${id}`),
          api.get(`/salespersons/${id}/achievement`),
        ]);
        setSp(spRes.data.data);
        setAchievement(achRes.data.data);
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
          <h1 className="text-2xl font-bold text-gray-800">Salesperson Detail</h1>
          <p className="text-gray-600 text-sm">{sp?.employee_code} - {sp?.name}</p>
        </div>
        <button
          onClick={() => { window.location.href = "/salespersons/" + id + "/edit"; }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Information</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-800">{sp?.name}</span></div>
            <div><span className="text-gray-500">Employee Code:</span> <span className="font-medium text-gray-800">{sp?.employee_code}</span></div>
            <div><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-800">{sp?.phone || '-'}</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-800">{sp?.email || '-'}</span></div>
            <div><span className="text-gray-500">Dealer:</span> <span className="font-medium text-gray-800">{sp?.dealer?.name || '-'}</span></div>
            <div><span className="text-gray-500">Join Date:</span> <span className="font-medium text-gray-800">{sp?.join_date || '-'}</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Achievement</h2>
          {achievement ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Units Sold:</span> <span className="font-medium text-gray-800">{achievement.units_sold}</span></div>
              <div><span className="text-gray-500">Revenue:</span> <span className="font-medium text-gray-800">Rp{achievement.actual_revenue?.toLocaleString('id-ID')}</span></div>
              <div><span className="text-gray-500">Achievement %:</span> <span className="font-medium text-gray-800">{achievement.achievement_revenue}%</span></div>
              <div><span className="text-gray-500">Conversion:</span> <span className="font-medium text-gray-800">{achievement.conversion_rate}%</span></div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No target for this period</p>
          )}
        </div>
      </div>
    </Layout>
  );
}