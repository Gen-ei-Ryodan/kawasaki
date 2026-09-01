'use client';

import { useState, type ReactElement } from 'react';
import { Lead, Dealer, Salesperson, VehicleModel } from '@/types';

interface LeadFormProps {
  lead: Lead | null;
  onSave: (data: Partial<Lead>) => void;
  onClose: () => void;
  saving?: boolean;
  dealers?: Dealer[];
  salespersons?: Salesperson[];
  models?: VehicleModel[];
}

export default function LeadForm({ lead, onSave, onClose, saving, dealers = [], salespersons = [], models = [] }: LeadFormProps): ReactElement {
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    phone: lead?.phone || '',
    email: lead?.email || '',
    source: lead?.source || '',
    interested_model_id: (lead as any)?.interested_model_id ? String((lead as any).interested_model_id) : '',
    salesperson_id: lead?.salesperson_id ? String(lead.salesperson_id) : '',
    dealer_id: lead?.dealer_id ? String(lead.dealer_id) : '',
    estimated_budget: lead?.estimated_budget ? String(lead.estimated_budget) : '',
    notes: lead?.notes || '',
    status: lead?.status || 'COLD',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      phone: formData.phone || null,
      email: formData.email || null,
      source: formData.source || null,
      interested_model_id: formData.interested_model_id ? Number(formData.interested_model_id) : null,
      salesperson_id: formData.salesperson_id ? Number(formData.salesperson_id) : null,
      dealer_id: formData.dealer_id ? Number(formData.dealer_id) : null,
      estimated_budget: formData.estimated_budget ? Number(formData.estimated_budget) : null,
      notes: formData.notes || null,
      status: formData.status,
    };
    onSave(data as Partial<Lead>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="COLD">Cold</option>
            <option value="WARM">Warm</option>
            <option value="HOT">Hot</option>
            <option value="HOLD">Hold</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select</option>
            {['WALK_IN','WEBSITE','WHATSAPP','INSTAGRAM','FACEBOOK','REFERRAL','EVENT','ADVERTISEMENT','PHONE','OTHER'].map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dealer</label>
          <select
            value={formData.dealer_id}
            onChange={(e) => setFormData({ ...formData, dealer_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select</option>
            {dealers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson</label>
          <select
            value={formData.salesperson_id}
            onChange={(e) => setFormData({ ...formData, salesperson_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select</option>
            {salespersons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interested Model</label>
          <select
            value={formData.interested_model_id}
            onChange={(e) => setFormData({ ...formData, interested_model_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select</option>
            {models.map((m) => <option key={m.id} value={m.id}>{m.brand} {m.model}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Budget</label>
          <input
            type="number"
            value={formData.estimated_budget}
            onChange={(e) => setFormData({ ...formData, estimated_budget: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={2}
        />
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
          {saving ? 'Saving...' : lead ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
