'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import SlidePanel from '@/components/SlidePanel';
import WarrantyClaimForm from '@/components/forms/WarrantyClaimForm';
import { WarrantyClaim, Vehicle, Customer, Warranty } from '@/types';

export default function WarrantyClaimsPage() {
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingClaim, setEditingClaim] = useState<WarrantyClaim | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const params: any = { per_page: 50 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const [clRes, vRes, cRes, wRes] = await Promise.all([
        api.get('/warranty-claims', { params }),
        api.get('/vehicles', { params: { per_page: 100 } }),
        api.get('/customers', { params: { per_page: 100 } }),
        api.get('/warranties', { params: { per_page: 100, status: 'ACTIVE' } }),
      ]);
      setClaims(clRes.data.data.data || []);
      setVehicles(vRes.data.data.data || []);
      setCustomers(cRes.data.data.data || []);
      setWarranties(wRes.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [search, statusFilter]);

  const handleSave = async (data: Partial<WarrantyClaim>) => {
    setSaving(true);
    try {
      if (editingClaim) {
        await api.put(`/warranty-claims/${editingClaim.id}`, data);
      } else {
        await api.post('/warranty-claims', data);
      }
      setPanelOpen(false);
      setEditingClaim(null);
      loadData();
    } catch (err: any) {
      console.error('Failed to save claim:', err);
      alert(err.response?.data?.message || 'Failed to save claim');
    } finally {
      setSaving(false);
    }
  };

  const closePanel = () => { setPanelOpen(false); setEditingClaim(null); };

  const statusColors: Record<string, string> = {
    SUBMITTED: 'bg-yellow-100 text-yellow-800', UNDER_REVIEW: 'bg-blue-100 text-blue-800',
    APPROVED: 'bg-green-100 text-green-800', REJECTED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-purple-100 text-purple-800',
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Warranty Claims</h1>
          <p className="text-gray-600 text-sm">Manage warranty claims and repairs</p>
        </div>
        <button
          onClick={() => { setEditingClaim(null); setPanelOpen(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          + New Claim
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search claim number..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Status</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Problem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.claim_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.vehicle_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.claim_date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.problem || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Rp{c.cost?.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => { setEditingClaim(c); setPanelOpen(true); }} className="text-yellow-600 hover:text-yellow-900">Edit</button>
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
        title={editingClaim ? 'Edit Warranty Claim' : 'Create Warranty Claim'}
        widthClass="max-w-2xl"
      >
        <WarrantyClaimForm
          claim={editingClaim}
          onSave={handleSave}
          onClose={closePanel}
          saving={saving}
          vehicles={vehicles}
          customers={customers}
          warranties={warranties}
        />
      </SlidePanel>
    </Layout>
  );
}
