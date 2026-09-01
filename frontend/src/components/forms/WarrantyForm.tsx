'use client';

import { useState, type ReactElement } from 'react';
import { Warranty, Vehicle, Customer } from '@/types';

interface WarrantyFormProps {
  warranty: Warranty | null;
  onSave: (data: Partial<Warranty>) => void;
  onClose: () => void;
  saving?: boolean;
  vehicles?: Vehicle[];
  customers?: Customer[];
}

export default function WarrantyForm({ warranty, onSave, onClose, saving, vehicles = [], customers = [] }: WarrantyFormProps): ReactElement {
  const [formData, setFormData] = useState({
    vehicle_id: warranty?.vehicle_id ? String(warranty.vehicle_id) : '',
    customer_id: warranty?.customer_id ? String(warranty.customer_id) : '',
    start_date: warranty?.start_date || '',
    end_date: warranty?.end_date || '',
    warranty_period: warranty?.warranty_period ? String(warranty.warranty_period) : '24',
    status: warranty?.status || 'ACTIVE',
    terms: warranty?.terms || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Warranty> = {
      vehicle_id: Number(formData.vehicle_id),
      customer_id: formData.customer_id ? Number(formData.customer_id) : null,
      start_date: formData.start_date,
      end_date: formData.end_date,
      warranty_period: Number(formData.warranty_period),
      status: formData.status,
      terms: formData.terms || null,
    };
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
          <select
            value={formData.vehicle_id}
            onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.vin} ({v.color})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <select
            value={formData.customer_id}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Period (months)</label>
          <input
            type="number"
            value={formData.warranty_period}
            onChange={(e) => setFormData({ ...formData, warranty_period: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Terms</label>
        <textarea
          value={formData.terms}
          onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="VOID">Void</option>
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium disabled:opacity-50"
        >
          {saving ? 'Saving...' : warranty ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
