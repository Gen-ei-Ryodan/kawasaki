'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { Dealer, Salesperson, VehicleModel } from '@/types';

export default function LeadFormPage({ isEdit = false }: { isEdit?: boolean }) {
  const router = useRouter();
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', source: '', interested_model_id: '',
    salesperson_id: '', dealer_id: '', estimated_budget: '', notes: '', status: 'COLD',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [dRes, sRes, mRes] = await Promise.all([
        api.get('/dealers', { params: { per_page: 100 } }),
        api.get('/salespersons', { params: { per_page: 100 } }),
        api.get('/vehicle-models', { params: { per_page: 100, status: 'ACTIVE' } }),
      ]);
      setDealers(dRes.data.data.data || []);
      setSalespersons(sRes.data.data.data || []);
      setModels(mRes.data.data.data || []);
      if (isEdit) {
        const id = window.location.pathname.split('/').pop();
        const res = await api.get(`/leads/${id}`);
        const l = res.data.data;
        setFormData({
          name: l.name, phone: l.phone || '', email: l.email || '', source: l.source || '',
          interested_model_id: String(l.interested_model_id || ''),
          salesperson_id: String(l.salesperson_id || ''),
          dealer_id: String(l.dealer_id || ''),
          estimated_budget: String(l.estimated_budget || ''),
          notes: l.notes || '', status: l.status,
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
        interested_model_id: formData.interested_model_id ? Number(formData.interested_model_id) : null,
        salesperson_id: formData.salesperson_id ? Number(formData.salesperson_id) : null,
        dealer_id: formData.dealer_id ? Number(formData.dealer_id) : null,
        estimated_budget: formData.estimated_budget ? Number(formData.estimated_budget) : null,
      };
      if (isEdit) {
        const id = window.location.pathname.split('/').pop();
        await api.put(`/leads/${id}`, data);
      } else {
        await api.post('/leads', data);
      }
      router.push('/leads');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save');
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="text-center py-10">Loading...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Lead' : 'Create Lead'}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                <option value="COLD">Cold</option>
                <option value="WARM">Warm</option>
                <option value="HOT">Hot</option>
                <option value="HOLD">Hold</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select value={formData.source}
                onChange={e => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                <option value="">Select</option>
                {['WALK_IN','WEBSITE','WHATSAPP','INSTAGRAM','FACEBOOK','REFERRAL','EVENT','ADVERTISEMENT','PHONE','OTHER'].map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson</label>
              <select value={formData.salesperson_id}
                onChange={e => setFormData({ ...formData, salesperson_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                <option value="">Select</option>
                {salespersons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interested Model</label>
              <select value={formData.interested_model_id}
                onChange={e => setFormData({ ...formData, interested_model_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                <option value="">Select</option>
                {models.map(m => <option key={m.id} value={m.id}>{m.brand} {m.model}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Budget</label>
              <input type="number" value={formData.estimated_budget}
                onChange={e => setFormData({ ...formData, estimated_budget: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" rows={2} />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={() => router.push('/leads')}
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