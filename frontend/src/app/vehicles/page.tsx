'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import SlidePanel from '@/components/SlidePanel';
import VehicleForm from '@/components/forms/VehicleForm';
import { Vehicle, VehicleModel, Dealer } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function VehiclesPage() {
  const { hasPermission } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const params: any = { per_page: 50 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const [vRes, mRes, dRes] = await Promise.all([
        api.get('/vehicles', { params }),
        api.get('/vehicle-models', { params: { per_page: 100, status: 'ACTIVE' } }),
        api.get('/dealers', { params: { per_page: 100 } }),
      ]);
      setVehicles(vRes.data.data.data || []);
      setModels(mRes.data.data.data || []);
      setDealers(dRes.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [search, statusFilter]);

  const handleSave = async (data: Partial<Vehicle>) => {
    setSaving(true);
    try {
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, data);
      } else {
        await api.post('/vehicles', data);
      }
      setPanelOpen(false);
      setEditingVehicle(null);
      loadData();
    } catch (err: any) {
      console.error('Failed to save vehicle:', err);
      alert(err.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this vehicle?')) return;
    try { await api.delete(`/vehicles/${id}`); loadData(); } catch (err) { console.error(err); }
  };

  const closePanel = () => { setPanelOpen(false); setEditingVehicle(null); };

  const statusColors: Record<string, string> = {
    IN_STOCK: 'bg-blue-100 text-blue-800', BOOKED: 'bg-yellow-100 text-yellow-800',
    SOLD: 'bg-green-100 text-green-800', DELIVERED: 'bg-purple-100 text-purple-800',
    IN_SERVICE: 'bg-orange-100 text-orange-800', TRANSFERRED: 'bg-gray-100 text-gray-800',
    SCRAPPED: 'bg-red-100 text-red-800',
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehicle Inventory</h1>
          <p className="text-gray-600 text-sm">Manage vehicle units and inventory</p>
        </div>
        {hasPermission('create-vehicles') && (
        <button
          onClick={() => { setEditingVehicle(null); setPanelOpen(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          + Add Vehicle
        </button>
        )}
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search VIN, engine, plate, code..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
        >
          <option value="">All Status</option>
          {['IN_STOCK','BOOKED','SOLD','DELIVERED','IN_SERVICE','TRANSFERRED','SCRAPPED'].map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">VIN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dealer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{v.vehicle_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{v.model?.brand} {v.model?.model}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">{v.vin}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{v.color || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{v.license_plate || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{v.dealer?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => { window.location.href = "/vehicles/" + v.id; }} className="text-blue-600 hover:text-blue-900">View</button>
                    {hasPermission('edit-vehicles') && (
                    <button onClick={() => { setEditingVehicle(v); setPanelOpen(true); }} className="text-yellow-600 hover:text-yellow-900">Edit</button>
                    )}
                    {hasPermission('delete-vehicles') && (
                    <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    )}
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
        title={editingVehicle ? 'Edit Vehicle' : 'Create Vehicle'}
        widthClass="max-w-2xl"
      >
        <VehicleForm
          vehicle={editingVehicle}
          onSave={handleSave}
          onClose={closePanel}
          saving={saving}
          models={models}
          dealers={dealers}
        />
      </SlidePanel>
    </Layout>
  );
}
