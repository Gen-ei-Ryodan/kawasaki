'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { Salesperson, Dealer } from '@/types';

export default function SalesTargetFormPage({ isEdit = false }: { isEdit?: boolean }) {
  const router = useRouter();
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [formData, setFormData] = useState({
    salesperson_id: '', dealer_id: '', period: '', target_units: '', target_revenue: '',
    start_date: '', end_date: '', status: 'ACTIVE',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [sRes, dRes] = await Promise.all([
        api.get('/salespersons', { params: { per_page: 100 } }),
        api.get('/dealers', { params: { per_page: 100 } }),
      ]);
      setSalespersons(sRes.data.data.data || []);
      setDealers(dRes.data.data.data || []);
      if (isEdit) {
        const id = window.location.pathname.split('/').pop();
        const res = await api.get(`/sales-targets/${id}`);
        const t = res.data.data;
        setFormData({
          salesperson_id: String(t.salesperson_id), dealer_id: String(t.dealer_id || ''),
          period: t.period, target_units: String(t.target_units), target_revenue: String(t.target_revenue),
          start_date: t.start_date || '', end_date: t.end_date || '', status: t.status,
        });
      }
      setLoading(false);
    }
    load();
  }, [isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data: any = {
        ...formData,
        salesperson_id: Number(formData.salesperson_id),
        dealer_id: formData.dealer_id ? Number(formData.dealer_id) : null,
        target_units: Number(formData.target_units),
        target_revenue: Number(formData.target_revenue),
      };
      if (isEdit) {
        const id = window.location.pathname.split('/').pop();
        await api.put(`/sales-targets/${id}`, data);
      } else {
        await api.post('/sales-targets', data);
      }
      router.push('/sales-targets');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save');
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="text-center py-10">Loading...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Sales Target' : 'Create Sales Target'}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson</label>
              <select value={formData.salesperson_id}
                onChange={e => setFormData({ ...formData, salesperson_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" required>
                <option value="">Select Salesperson</option>
                {salespersons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <input type="text" value={formData.period}
                onChange={e => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g. 2026-09"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dealer</label>
              <select value={formData.dealer_id}
                onChange={e => setFormData({ ...formData, dealer_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                <option value="">Select</option>
                {dealers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Units</label>
              <input type="number" value={formData.target_units}
                onChange={e => setFormData({ ...formData, target_units: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Revenue</label>
              <input type="number" value={formData.target_revenue}
                onChange={e => setFormData({ ...formData, target_revenue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" value={formData.end_date}
                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={() => router.push('/sales-targets')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}