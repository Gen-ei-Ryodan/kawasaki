'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import SlidePanel from '@/components/SlidePanel';
import ServiceForm from '@/components/forms/ServiceForm';
import { ServiceRecord, Vehicle, Customer, Dealer } from '@/types';

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const params: any = { per_page: 50 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const [sRes, vRes, cRes, dRes] = await Promise.all([
        api.get('/services', { params }),
        api.get('/vehicles', { params: { per_page: 100 } }),
        api.get('/customers', { params: { per_page: 100 } }),
        api.get('/dealers', { params: { per_page: 100 } }),
      ]);
      setServices(sRes.data.data.data || []);
      setVehicles(vRes.data.data.data || []);
      setCustomers(cRes.data.data.data || []);
      setDealers(dRes.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [search, statusFilter]);

  const handleSave = async (data: Partial<ServiceRecord>) => {
    setSaving(true);
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, data);
      } else {
        await api.post('/services', data);
      }
      setPanelOpen(false);
      setEditingService(null);
      loadData();
    } catch (err: any) {
      console.error('Failed to save service:', err);
      alert(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const closePanel = () => { setPanelOpen(false); setEditingService(null); };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800', IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Service Management</h1>
          <p className="text-gray-600 text-sm">Manage vehicle service records</p>
        </div>
        <button
          onClick={() => { setEditingService(null); setPanelOpen(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          + New Service
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search service number..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.service_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {vehicles.find(v => v.id === s.vehicle_id)?.vin || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{s.service_date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{s.service_type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{s.odometer || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Rp{s.total_cost.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => { window.location.href = "/services/" + s.id; }} className="text-blue-600 hover:text-blue-900">View</button>
                    <button onClick={() => { setEditingService(s); setPanelOpen(true); }} className="text-yellow-600 hover:text-yellow-900">Edit</button>
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
        title={editingService ? 'Edit Service' : 'Create Service'}
        widthClass="max-w-2xl"
      >
        <ServiceForm
          service={editingService}
          onSave={handleSave}
          onClose={closePanel}
          saving={saving}
          vehicles={vehicles}
          customers={customers}
          dealers={dealers}
        />
      </SlidePanel>
    </Layout>
  );
}
