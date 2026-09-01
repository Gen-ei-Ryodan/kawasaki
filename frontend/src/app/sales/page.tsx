'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import SlidePanel from '@/components/SlidePanel';
import SalesForm from '@/components/forms/SalesForm';
import { SalesTransaction, Customer, Vehicle, Salesperson, Dealer } from '@/types';

export default function SalesPage() {
  const [sales, setSales] = useState<SalesTransaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const params: any = { per_page: 50 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const [sRes, cRes, vRes, spRes, dRes] = await Promise.all([
        api.get('/sales', { params }),
        api.get('/customers', { params: { per_page: 100 } }),
        api.get('/vehicles', { params: { per_page: 100, status: 'IN_STOCK' } }),
        api.get('/salespersons', { params: { per_page: 100 } }),
        api.get('/dealers', { params: { per_page: 100 } }),
      ]);
      setSales(sRes.data.data.data || []);
      setCustomers(cRes.data.data.data || []);
      setVehicles(vRes.data.data.data || []);
      setSalespersons(spRes.data.data.data || []);
      setDealers(dRes.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [search, statusFilter]);

  const handleSave = async (data: Partial<SalesTransaction>) => {
    setSaving(true);
    try {
      // Compute final price on the client
      const final = (data.vehicle_price ?? 0) - (data.discount ?? 0) + (data.additional_cost ?? 0);
      const payload: Partial<SalesTransaction> = { ...data, final_price: final };
      await api.post('/sales', payload);
      setPanelOpen(false);
      loadData();
    } catch (err: any) {
      console.error('Failed to save sale:', err);
      alert(err.response?.data?.message || 'Failed to save sale');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (id: number) => {
    if (!confirm('Complete this sale?')) return;
    try { await api.put(`/sales/${id}/complete`, {}); loadData(); } catch (err: any) { alert(err.response?.data?.message); }
  };

  const closePanel = () => { setPanelOpen(false); };

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800', BOOKED: 'bg-blue-100 text-blue-800',
    SOLD: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sales Transaction</h1>
          <p className="text-gray-600 text-sm">Manage sales transactions</p>
        </div>
        <button
          onClick={() => { setPanelOpen(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          + New Sale
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transaction number..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="BOOKED">Booked</option>
          <option value="SOLD">Sold</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salesperson</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.transaction_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {customers.find(c => c.id === s.customer_id)?.full_name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {vehicles.find(v => v.id === s.vehicle_id)?.vin || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {salespersons.find(sp => sp.id === s.salesperson_id)?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">Rp{s.final_price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{s.payment_status}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    {s.status !== 'SOLD' && s.status !== 'CANCELLED' && (
                      <button onClick={() => handleComplete(s.id)} className="text-green-600 hover:text-green-900">Complete</button>
                    )}
                    <button onClick={() => { window.location.href = "/sales/" + s.id; }} className="text-blue-600 hover:text-blue-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <SlidePanel
        isOpen={panelOpen}
        onClose={closePanel}
        title="Create Sales Transaction"
        widthClass="max-w-2xl"
      >
        <SalesForm
          sale={null}
          onSave={handleSave}
          onClose={closePanel}
          saving={saving}
          customers={customers}
          vehicles={vehicles}
          salespersons={salespersons}
          dealers={dealers}
        />
      </SlidePanel>
    </Layout>
  );
}
