'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import SlidePanel from '@/components/SlidePanel';
import DealerForm from '@/components/forms/DealerForm';
import { Dealer } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function DealersPage() {
  const { hasPermission } = useAuth();
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);
  const [search, setSearch] = useState('');

  const loadDealers = async () => {
    try {
      const response = await api.get('/dealers', { params: { search, per_page: 50 } });
      setDealers(response.data.data.data || []);
    } catch (err) {
      console.error('Failed to load dealers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDealers(); }, [search]);

  const handleSave = async (data: Partial<Dealer>) => {
    try {
      if (editingDealer) {
        await api.put(`/dealers/${editingDealer.id}`, data);
      } else {
        await api.post('/dealers', data);
      }
      setPanelOpen(false);
      setEditingDealer(null);
      loadDealers();
    } catch (err: any) {
      console.error('Failed to save dealer:', err);
      alert(err.response?.data?.message || 'Failed to save dealer');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this dealer?')) return;
    try {
      await api.delete(`/dealers/${id}`);
      loadDealers();
    } catch (err) {
      console.error('Failed to delete dealer:', err);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dealer Management</h1>
          <p className="text-gray-600 text-sm">Manage all Kawasaki dealers and branches</p>
        </div>
        {hasPermission('create-dealers') && (
        <button
          onClick={() => { setEditingDealer(null); setPanelOpen(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          + Add Dealer
        </button>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dealers..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
        />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dealers.map((dealer) => (
                <tr key={dealer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{dealer.dealer_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{dealer.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{dealer.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{dealer.city || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      dealer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {dealer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    {hasPermission('edit-dealers') && (
                    <button
                      onClick={() => { setEditingDealer(dealer); setPanelOpen(true); }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    )}
                    {hasPermission('delete-dealers') && (
                    <button
                      onClick={() => handleDelete(dealer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
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
        onClose={() => { setPanelOpen(false); setEditingDealer(null); }}
        title={editingDealer ? 'Edit Dealer' : 'Create Dealer'}
      >
        <DealerForm
          dealer={editingDealer}
          onSave={handleSave}
          onClose={() => { setPanelOpen(false); setEditingDealer(null); }}
        />
      </SlidePanel>
    </Layout>
  );
}