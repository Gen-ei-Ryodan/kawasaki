'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { Customer, Vehicle, Salesperson, Dealer } from '@/types';

export default function CreateSalePage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [formData, setFormData] = useState({
    customer_id: '', vehicle_id: '', salesperson_id: '', dealer_id: '',
    sale_date: '', vehicle_price: '', discount: '', additional_cost: '',
    payment_method: '', payment_status: 'UNPAID', status: 'DRAFT',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [cRes, vRes, spRes, dRes] = await Promise.all([
        api.get('/customers', { params: { per_page: 100 } }),
        api.get('/vehicles', { params: { per_page: 100, status: 'IN_STOCK' } }),
        api.get('/salespersons', { params: { per_page: 100 } }),
        api.get('/dealers', { params: { per_page: 100 } }),
      ]);
      setCustomers(cRes.data.data.data || []);
      setVehicles(vRes.data.data.data || []);
      setSalespersons(spRes.data.data.data || []);
      setDealers(dRes.data.data.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data: any = {
        ...formData,
        customer_id: formData.customer_id ? Number(formData.customer_id) : null,
        vehicle_id: formData.vehicle_id ? Number(formData.vehicle_id) : null,
        salesperson_id: formData.salesperson_id ? Number(formData.salesperson_id) : null,
        dealer_id: formData.dealer_id ? Number(formData.dealer_id) : null,
        vehicle_price: Number(formData.vehicle_price) || 0,
        discount: Number(formData.discount) || 0,
        additional_cost: Number(formData.additional_cost) || 0,
      };
      data.final_price = data.vehicle_price - data.discount + data.additional_cost;
      await api.post('/sales', data);
      router.push('/sales');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save');
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="text-center py-10">Loading...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Sales Transaction</h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select value={formData.customer_id}
                onChange={e => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
              <select value={formData.vehicle_id}
                onChange={e => setFormData({ ...formData, vehicle_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                <option value="">Select Vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.vin} ({v.color})</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson</label>
              <select value={formData.salesperson_id}
                onChange={e => setFormData({ ...formData, salesperson_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                <option value="">Select</option>
                {salespersons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Date</label>
              <input type="date" value={formData.sale_date}
                onChange={e => setFormData({ ...formData, sale_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Price</label>
              <input type="number" value={formData.vehicle_price}
                onChange={e => setFormData({ ...formData, vehicle_price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
              <input type="number" value={formData.discount}
                onChange={e => setFormData({ ...formData, discount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Cost</label>
              <input type="number" value={formData.additional_cost}
                onChange={e => setFormData({ ...formData, additional_cost: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select value={formData.payment_method}
                onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                <option value="">Select</option>
                <option value="CASH">Cash</option>
                <option value="CREDIT">Credit</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select value={formData.payment_status}
                onChange={e => setFormData({ ...formData, payment_status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500">
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIAL">Partial</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={() => router.push('/sales')}
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