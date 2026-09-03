'use client';

import { useState, type ReactElement } from 'react';
import { SalesTarget, Salesperson, Dealer } from '@/types';

interface SalesTargetFormProps {
  target: SalesTarget | null;
  onSave: (data: Partial<SalesTarget>) => void;
  onClose: () => void;
  saving?: boolean;
  salespersons?: Salesperson[];
  dealers?: Dealer[];
}

export default function SalesTargetForm({ target, onSave, onClose, saving, salespersons = [], dealers = [] }: SalesTargetFormProps): ReactElement {
  const [formData, setFormData] = useState({
    salesperson_id: target?.salesperson_id ? String(target.salesperson_id) : '',
    dealer_id: target?.dealer_id ? String(target.dealer_id) : '',
    period: target?.period || '',
    target_units: target?.target_units ? String(target.target_units) : '',
    target_revenue: target?.target_revenue ? String(target.target_revenue) : '',
    start_date: target?.start_date || '',
    end_date: target?.end_date || '',
    status: target?.status || 'ACTIVE',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<SalesTarget> = {
      salesperson_id: Number(formData.salesperson_id),
      dealer_id: formData.dealer_id ? Number(formData.dealer_id) : null,
      period: formData.period,
      target_units: Number(formData.target_units),
      target_revenue: Number(formData.target_revenue),
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      status: formData.status,
    };
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson</label>
          <select
            value={formData.salesperson_id}
            onChange={(e) => setFormData({ ...formData, salesperson_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
            required
          >
            <option value="">Select Salesperson</option>
            {salespersons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
          <input
            type="text"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            placeholder="e.g. 2026-09"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dealer</label>
          <select
            value={formData.dealer_id}
            onChange={(e) => setFormData({ ...formData, dealer_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          >
            <option value="">Select</option>
            {dealers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Units</label>
          <input
            type="number"
            value={formData.target_units}
            onChange={(e) => setFormData({ ...formData, target_units: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Revenue</label>
          <input
            type="number"
            value={formData.target_revenue}
            onChange={(e) => setFormData({ ...formData, target_revenue: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
        >
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
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
          {saving ? 'Saving...' : target ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
