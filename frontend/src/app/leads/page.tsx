'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import SlidePanel from '@/components/SlidePanel';
import LeadForm from '@/components/forms/LeadForm';
import { Lead, Dealer, Salesperson, VehicleModel } from '@/types';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const params: any = { per_page: 50 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const [leadsRes, dRes, sRes, mRes] = await Promise.all([
        api.get('/leads', { params }),
        api.get('/dealers', { params: { per_page: 100 } }),
        api.get('/salespersons', { params: { per_page: 100 } }),
        api.get('/vehicle-models', { params: { per_page: 100, status: 'ACTIVE' } }),
      ]);
      setLeads(leadsRes.data.data.data || []);
      setDealers(dRes.data.data.data || []);
      setSalespersons(sRes.data.data.data || []);
      setModels(mRes.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [search, statusFilter]);

  const handleSave = async (data: Partial<Lead>) => {
    setSaving(true);
    try {
      if (editingLead) {
        await api.put(`/leads/${editingLead.id}`, data);
      } else {
        await api.post('/leads', data);
      }
      setPanelOpen(false);
      setEditingLead(null);
      loadData();
    } catch (err: any) {
      console.error('Failed to save lead:', err);
      alert(err.response?.data?.message || 'Failed to save lead');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this lead?')) return;
    try { await api.delete(`/leads/${id}`); loadData(); } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (lead: Lead, newStatus: string) => {
    try {
      await api.put(`/leads/${lead.id}/status`, { status: newStatus });
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to change status');
    }
  };

  const closePanel = () => { setPanelOpen(false); setEditingLead(null); };

  const statusColors: Record<string, string> = {
    COLD: 'bg-blue-100 text-blue-800', WARM: 'bg-yellow-100 text-yellow-800',
    HOT: 'bg-red-100 text-red-800', HOLD: 'bg-gray-100 text-gray-800',
    WON: 'bg-green-100 text-green-800', LOST: 'bg-gray-100 text-gray-800',
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lead Management</h1>
          <p className="text-gray-600 text-sm">Manage sales leads and pipeline</p>
        </div>
        <button
          onClick={() => { setEditingLead(null); setPanelOpen(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          + Add Lead
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, email..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
        >
          <option value="">All Status</option>
          <option value="COLD">Cold</option>
          <option value="WARM">Warm</option>
          <option value="HOT">Hot</option>
          <option value="HOLD">Hold</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salesperson</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.lead_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{lead.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{lead.source || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {salespersons.find(s => s.id === lead.salesperson_id)?.name || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs border-0 ${statusColors[lead.status]}`}
                    >
                      <option value="COLD">Cold</option>
                      <option value="WARM">Warm</option>
                      <option value="HOT">Hot</option>
                      <option value="HOLD">Hold</option>
                      <option value="WON">Won</option>
                      <option value="LOST">Lost</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => { window.location.href = "/leads/" + lead.id; }} className="text-blue-600 hover:text-blue-900">View</button>
                    <button onClick={() => { setEditingLead(lead); setPanelOpen(true); }} className="text-yellow-600 hover:text-yellow-900">Edit</button>
                    <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
        title={editingLead ? 'Edit Lead' : 'Create Lead'}
        widthClass="max-w-2xl"
      >
        <LeadForm
          lead={editingLead}
          onSave={handleSave}
          onClose={closePanel}
          saving={saving}
          dealers={dealers}
          salespersons={salespersons}
          models={models}
        />
      </SlidePanel>
    </Layout>
  );
}
