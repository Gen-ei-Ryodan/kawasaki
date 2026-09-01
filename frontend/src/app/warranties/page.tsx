'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import SlidePanel from '@/components/SlidePanel';
import WarrantyForm from '@/components/forms/WarrantyForm';
import { Warranty, Vehicle, Customer } from '@/types';

export default function WarrantiesPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const params: any = { per_page: 50 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const [wRes, vRes, cRes] = await Promise.all([
        api.get('/warranties', { params }),
        api.get('/vehicles', { params: { per_page: 100 } }),
        api.get('/customers', { params: { per_page: 100 } }),
      ]);
      setWarranties(wRes.data.data.data || []);
      setVehicles(vRes.data.data.data || []);
      setCustomers(cRes.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [search, statusFilter]);

  const handleSave = async (data: Partial<Warranty>) => {
    setSaving(true);
    try {
      if (editingWarranty) {
        await api.put(`/warranties/${editingWarranty.id}`, data);
      } else {
        await api.post('/warranties', data);
      }
      setPanelOpen(false);
      setEditingWarranty(null);
      loadData();
    } catch (err: any) {
      console.error('Failed to save warranty:', err);
      alert(err.response?.data?.message || 'Failed to save warranty');
    } finally {
      setSaving(false);
    }
  };

  const closePanel = () => { setPanelOpen(false); setEditingWarranty(null); };

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800', EXPIRED: 'bg-gray-100 text-gray-800', VOID: 'bg-red-100 text-red-800',
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Warranty Management</h1>
          <p className="text-gray-600 text-sm">Manage vehicle warranties and claims</p>
        </div>
        <button
          onClick={() => { setEditingWarranty(null); setPanelOpen(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          + New Warranty
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search warranty number..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="VOID">Void</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warranty #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {warranties.map(w => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{w.warranty_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {vehicles.find(v => v.id === w.vehicle_id)?.vin || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{w.start_date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{w.end_date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{w.warranty_period} months</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[w.status]}`}>{w.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => { window.location.href = "/warranties/" + w.id; }} className="text-blue-600 hover:text-blue-900">View</button>
                    <button onClick={() => { setEditingWarranty(w); setPanelOpen(true); }} className="text-yellow-600 hover:text-yellow-900">Edit</button>
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
        title={editingWarranty ? 'Edit Warranty' : 'Create Warranty'}
        widthClass="max-w-2xl"
      >
        <WarrantyForm
          warranty={editingWarranty}
          onSave={handleSave}
          onClose={closePanel}
          saving={saving}
          vehicles={vehicles}
          customers={customers}
        />
      </SlidePanel>
    </Layout>
  );
}
