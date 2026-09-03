'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { Vehicle, Customer } from '@/types';

export default function WarrantyClaimFormPage({ isEdit = false }: { isEdit?: boolean }) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [warranties, setWarranties] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    vehicle_id: '', customer_id: '', warranty_id: '', service_record_id: '',
    claim_date: '', problem: '', diagnosis: '', resolution: '', cost: '', status: 'SUBMITTED',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [vRes, cRes, wRes] = await Promise.all([
        api.get('/vehicles', { params: { per_page: 100 } }),
        api.get('/customers', { params: { per_page: 100 } }),
        api.get('/warranties', { params: { per_page: 100, status: 'ACTIVE' } }),
      ]);
      setVehicles(vRes.data.data.data || []);
      setCustomers(cRes.data.data.data || []);
      setWarranties(wRes.data.data.data || []);
      if (isEdit) {
        const id = window.location.pathname.split('/').pop();
        const res = await api.get('/warranty-claims/' + id);
        const c = res.data.data;
        setFormData({
          vehicle_id: String(c.vehicle_id), customer_id: String(c.customer_id || ''),
          warranty_id: String(c.warranty_id || ''), service_record_id: String(c.service_record_id || ''),
          claim_date: c.claim_date, problem: c.problem || '', diagnosis: c.diagnosis || '',
          resolution: c.resolution || '', cost: String(c.cost || ''), status: c.status,
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
        vehicle_id: Number(formData.vehicle_id),
        customer_id: formData.customer_id ? Number(formData.customer_id) : null,
        warranty_id: formData.warranty_id ? Number(formData.warranty_id) : null,
        service_record_id: formData.service_record_id ? Number(formData.service_record_id) : null,
        cost: Number(formData.cost) || 0,
      };
      if (isEdit) {
        const id = window.location.pathname.split('/').pop();
        await api.put('/warranty-claims/' + id, data);
      } else {
        await api.post('/warranty-claims', data);
      }
      router.push('/warranty-claims');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save');
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="text-center py-10">Loading...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Warranty Claim' : 'Create Warranty Claim'}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
              <select value={formData.vehicle_id}
                onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" required>
                <option value="">Select Vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.vin} ({v.color})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Claim Date</label>
              <input type="date" value={formData.claim_date}
                onChange={e => setFormData({ ...formData, claim_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select value={formData.customer_id}
                onChange={e => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400">
                <option value="">Select</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
              <select value={formData.warranty_id}
                onChange={e => setFormData({ ...formData, warranty_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400">
                <option value="">Select</option>
                {warranties.map(w => <option key={w.id} value={w.id}>{w.warranty_number}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400">
                {['SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','COMPLETED'].map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Problem</label>
            <textarea value={formData.problem}
              onChange={e => setFormData({ ...formData, problem: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
            <textarea value={formData.diagnosis}
              onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
            <textarea value={formData.resolution}
              onChange={e => setFormData({ ...formData, resolution: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
            <input type="number" value={formData.cost}
              onChange={e => setFormData({ ...formData, cost: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={() => router.push('/warranty-claims')}
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