'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { Vehicle, Customer, Dealer } from '@/types';

export default function ServiceBookingFormPage({ isEdit = false }: { isEdit?: boolean }) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [formData, setFormData] = useState({
    vehicle_id: '', customer_id: '', dealer_id: '', booking_date: '',
    booking_time: '', service_type: 'ROUTINE', complaint: '',
    assigned_advisor_id: '', status: 'REQUESTED',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [vRes, cRes, dRes] = await Promise.all([
        api.get('/vehicles', { params: { per_page: 100 } }),
        api.get('/customers', { params: { per_page: 100 } }),
        api.get('/dealers', { params: { per_page: 100 } }),
      ]);
      setVehicles(vRes.data.data.data || []);
      setCustomers(cRes.data.data.data || []);
      setDealers(dRes.data.data.data || []);
      if (isEdit) {
        const id = window.location.pathname.split('/').pop();
        const res = await api.get('/service-bookings/' + id);
        const b = res.data.data;
        setFormData({
          vehicle_id: String(b.vehicle_id), customer_id: String(b.customer_id || ''),
          dealer_id: String(b.dealer_id || ''), booking_date: b.booking_date,
          booking_time: b.booking_time || '', service_type: b.service_type,
          complaint: b.complaint || '', assigned_advisor_id: String(b.assigned_advisor_id || ''),
          status: b.status,
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
        dealer_id: formData.dealer_id ? Number(formData.dealer_id) : null,
        assigned_advisor_id: formData.assigned_advisor_id ? Number(formData.assigned_advisor_id) : null,
      };
      if (isEdit) {
        const id = window.location.pathname.split('/').pop();
        await api.put('/service-bookings/' + id, data);
      } else {
        await api.post('/service-bookings', data);
      }
      router.push('/service-bookings');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save');
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="text-center py-10">Loading...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Service Booking' : 'Create Service Booking'}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
              <select value={formData.vehicle_id}
                onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" required>
                <option value="">Select Vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.vin} ({v.color})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
              <input type="date" value={formData.booking_date}
                onChange={e => setFormData({ ...formData, booking_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select value={formData.customer_id}
                onChange={e => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                <option value="">Select</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
              <select value={formData.service_type}
                onChange={e => setFormData({ ...formData, service_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                {['ROUTINE','PERIODIC','REPAIR','WARRANTY','INSPECTION','OTHER'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Time</label>
              <input type="time" value={formData.booking_time}
                onChange={e => setFormData({ ...formData, booking_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                {['REQUESTED','CONFIRMED','ARRIVED','IN_PROGRESS','COMPLETED','CANCELLED','NO_SHOW'].map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Complaint</label>
            <textarea value={formData.complaint}
              onChange={e => setFormData({ ...formData, complaint: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" rows={2} />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={() => router.push('/service-bookings')}
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