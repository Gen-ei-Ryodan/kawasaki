'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import SlidePanel from '@/components/SlidePanel';
import CustomerForm from '@/components/forms/CustomerForm';
import { Customer } from '@/types';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);

  const loadCustomers = async () => {
    try {
      const params: any = { per_page: 50 };
      if (search) params.search = search;
      const response = await api.get('/customers', { params });
      setCustomers(response.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCustomers(); }, [search]);

  const handleSave = async (data: Partial<Customer>) => {
    setSaving(true);
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, data);
      } else {
        await api.post('/customers', data);
      }
      setPanelOpen(false);
      setEditingCustomer(null);
      loadCustomers();
    } catch (err: any) {
      console.error('Failed to save customer:', err);
      alert(err.response?.data?.message || 'Failed to save customer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this customer?')) return;
    try { await api.delete('/customers/' + id); loadCustomers(); } catch (err) { console.error(err); }
  };

  const closePanel = () => { setPanelOpen(false); setEditingCustomer(null); };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
          <p className="text-gray-600 text-sm">Manage Kawasaki customers</p>
        </div>
        <button
          onClick={() => { setEditingCustomer(null); setPanelOpen(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          + Add Customer
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, email, customer code..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.customer_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{c.full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.email || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.city || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => { window.location.href = '/customers/' + c.id; }} className="text-blue-600 hover:text-blue-900">View</button>
                    <button onClick={() => { setEditingCustomer(c); setPanelOpen(true); }} className="text-yellow-600 hover:text-yellow-900">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
        title={editingCustomer ? 'Edit Customer' : 'Create Customer'}
        widthClass="max-w-2xl"
      >
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSave}
          onClose={closePanel}
          saving={saving}
        />
      </SlidePanel>
    </Layout>
  );
}
