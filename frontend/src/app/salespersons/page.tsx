'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import SlidePanel from '@/components/SlidePanel';
import SalespersonForm from '@/components/forms/SalespersonForm';
import { Salesperson, Dealer } from '@/types';

export default function SalespersonsPage() {
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dealerFilter, setDealerFilter] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingSalesperson, setEditingSalesperson] = useState<Salesperson | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const params: any = { per_page: 50 };
      if (search) params.search = search;
      if (dealerFilter) params.dealer_id = dealerFilter;
      const [spRes, dRes] = await Promise.all([
        api.get('/salespersons', { params }),
        api.get('/dealers', { params: { per_page: 100 } }),
      ]);
      setSalespersons(spRes.data.data.data || []);
      setDealers(dRes.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [search, dealerFilter]);

  const handleSave = async (data: Partial<Salesperson>) => {
    setSaving(true);
    try {
      if (editingSalesperson) {
        await api.put(`/salespersons/${editingSalesperson.id}`, data);
      } else {
        await api.post('/salespersons', data);
      }
      setPanelOpen(false);
      setEditingSalesperson(null);
      loadData();
    } catch (err: any) {
      console.error('Failed to save salesperson:', err);
      alert(err.response?.data?.message || 'Failed to save salesperson');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this salesperson?')) return;
    try { await api.delete(`/salespersons/${id}`); loadData(); } catch (err) { console.error(err); }
  };

  const closePanel = () => { setPanelOpen(false); setEditingSalesperson(null); };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Salesperson Management</h1>
          <p className="text-gray-600 text-sm">Manage Kawasaki sales team</p>
        </div>
        <button
          onClick={() => { setEditingSalesperson(null); setPanelOpen(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          + Add Salesperson
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, employee code..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <select
          value={dealerFilter}
          onChange={(e) => setDealerFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Dealers</option>
          {dealers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dealer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salespersons.map(sp => (
                <tr key={sp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{sp.employee_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{sp.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{sp.dealer?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{sp.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{sp.join_date || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${sp.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {sp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => { window.location.href = "/salespersons/" + sp.id; }} className="text-blue-600 hover:text-blue-900">View</button>
                    <button onClick={() => { setEditingSalesperson(sp); setPanelOpen(true); }} className="text-yellow-600 hover:text-yellow-900">Edit</button>
                    <button onClick={() => handleDelete(sp.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
        title={editingSalesperson ? 'Edit Salesperson' : 'Create Salesperson'}
        widthClass="max-w-2xl"
      >
        <SalespersonForm
          salesperson={editingSalesperson}
          onSave={handleSave}
          onClose={closePanel}
          saving={saving}
          dealers={dealers}
        />
      </SlidePanel>
    </Layout>
  );
}
