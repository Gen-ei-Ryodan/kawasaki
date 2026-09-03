'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import SlidePanel from '@/components/SlidePanel';
import VehicleModelForm from '@/components/forms/VehicleModelForm';
import { VehicleModel } from '@/types';

export default function VehicleModelsPage() {
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);
  const [saving, setSaving] = useState(false);

  const loadModels = async () => {
    try {
      const params: any = { per_page: 50 };
      if (search) params.search = search;
      const response = await api.get('/vehicle-models', { params });
      setModels(response.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadModels(); }, [search]);

  const handleSave = async (data: Partial<VehicleModel>) => {
    setSaving(true);
    try {
      if (editingModel) {
        await api.put(`/vehicle-models/${editingModel.id}`, data);
      } else {
        await api.post('/vehicle-models', data);
      }
      setPanelOpen(false);
      setEditingModel(null);
      loadModels();
    } catch (err: any) {
      console.error('Failed to save model:', err);
      alert(err.response?.data?.message || 'Failed to save model');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this vehicle model?')) return;
    try { await api.delete(`/vehicle-models/${id}`); loadModels(); } catch (err) { console.error(err); }
  };

  const closePanel = () => { setPanelOpen(false); setEditingModel(null); };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehicle Model Management</h1>
          <p className="text-gray-600 text-sm">Manage Kawasaki motorcycle models</p>
        </div>
        <button
          onClick={() => { setEditingModel(null); setPanelOpen(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          + Add Model
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brand, model..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engine CC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {models.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.brand}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{m.model}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{m.variant || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{m.year || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{m.engine_cc || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${m.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => { setEditingModel(m); setPanelOpen(true); }} className="text-yellow-600 hover:text-yellow-900">Edit</button>
                    <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
        title={editingModel ? 'Edit Vehicle Model' : 'Create Vehicle Model'}
        widthClass="max-w-2xl"
      >
        <VehicleModelForm
          model={editingModel}
          onSave={handleSave}
          onClose={closePanel}
          saving={saving}
        />
      </SlidePanel>
    </Layout>
  );
}
