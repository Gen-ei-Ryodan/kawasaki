'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { VehicleModel, Dealer } from '@/types';

export default function VehicleFormPage({ isEdit = false }: { isEdit?: boolean }) {
  const router = useRouter();
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [formData, setFormData] = useState({
    vehicle_model_id: '', vin: '', engine_number: '', color: '', year: '',
    license_plate: '', odometer: '', dealer_id: '', status: 'IN_STOCK',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [mRes, dRes] = await Promise.all([
        api.get('/vehicle-models', { params: { per_page: 100, status: 'ACTIVE' } }),
        api.get('/dealers', { params: { per_page: 100 } }),
      ]);
      setModels(mRes.data.data.data || []);
      setDealers(dRes.data.data.data || []);
      if (isEdit) {
        const id = window.location.pathname.split('/').pop();
        const res = await api.get(`/vehicles/${id}`);
        const v = res.data.data;
        setFormData({
          vehicle_model_id: String(v.vehicle_model_id), vin: v.vin, engine_number: v.engine_number,
          color: v.color || '', year: String(v.year || ''), license_plate: v.license_plate || '',
          odometer: String(v.odometer || ''), dealer_id: String(v.dealer_id || ''), status: v.status,
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
        vehicle_model_id: Number(formData.vehicle_model_id),
        year: Number(formData.year) || null,
        odometer: Number(formData.odometer) || 0,
        dealer_id: formData.dealer_id ? Number(formData.dealer_id) : null,
      };
      if (isEdit) {
        const id = window.location.pathname.split('/').pop();
        await api.put(`/vehicles/${id}`, data);
      } else {
        await api.post('/vehicles', data);
      }
      router.push('/vehicles');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save');
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="text-center py-10">Loading...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Vehicle' : 'Create Vehicle'}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select value={formData.vehicle_model_id}
                onChange={e => setFormData({ ...formData, vehicle_model_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" required>
                <option value="">Select Model</option>
                {models.map(m => <option key={m.id} value={m.id}>{m.brand} {m.model} {m.variant || ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400">
                {['IN_STOCK','BOOKED','SOLD','DELIVERED','IN_SERVICE','TRANSFERRED','SCRAPPED'].map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
              <input type="text" value={formData.vin}
                onChange={e => setFormData({ ...formData, vin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
              <input type="text" value={formData.engine_number}
                onChange={e => setFormData({ ...formData, engine_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input type="text" value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <input type="text" value={formData.license_plate}
                onChange={e => setFormData({ ...formData, license_plate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Odometer (KM)</label>
              <input type="number" value={formData.odometer}
                onChange={e => setFormData({ ...formData, odometer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dealer</label>
              <select value={formData.dealer_id}
                onChange={e => setFormData({ ...formData, dealer_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400">
                <option value="">Select Dealer</option>
                {dealers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={() => router.push('/vehicles')}
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