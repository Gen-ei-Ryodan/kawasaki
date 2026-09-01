'use client';

import { useState, type ReactElement } from 'react';
import { WarrantyClaim, Vehicle, Customer, Warranty } from '@/types';

interface WarrantyClaimFormProps {
  claim: WarrantyClaim | null;
  onSave: (data: Partial<WarrantyClaim>) => void;
  onClose: () => void;
  saving?: boolean;
  vehicles?: Vehicle[];
  customers?: Customer[];
  warranties?: Warranty[];
}

export default function WarrantyClaimForm({ claim, onSave, onClose, saving, vehicles = [], customers = [], warranties = [] }: WarrantyClaimFormProps): ReactElement {
  const [formData, setFormData] = useState({
    vehicle_id: claim?.vehicle_id ? String(claim.vehicle_id) : '',
    customer_id: claim?.customer_id ? String(claim.customer_id) : '',
    warranty_id: claim?.warranty_id ? String(claim.warranty_id) : '',
    service_record_id: claim?.service_record_id ? String(claim.service_record_id) : '',
    claim_date: claim?.claim_date || '',
    problem: claim?.problem || '',
    diagnosis: claim?.diagnosis || '',
    resolution: claim?.resolution || '',
    cost: claim?.cost ? String(claim.cost) : '',
    status: claim?.status || 'SUBMITTED',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<WarrantyClaim> = {
      vehicle_id: Number(formData.vehicle_id),
      customer_id: formData.customer_id ? Number(formData.customer_id) : null,
      warranty_id: formData.warranty_id ? Number(formData.warranty_id) : null,
      service_record_id: formData.service_record_id ? Number(formData.service_record_id) : null,
      claim_date: formData.claim_date,
      problem: formData.problem || null,
      diagnosis: formData.diagnosis || null,
      resolution: formData.resolution || null,
      cost: Number(formData.cost) || 0,
      status: formData.status,
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Claim Date</label>
          <input
            type="date"
            value={formData.claim_date}
            onChange={(e) => setFormData({ ...formData, claim_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
          <select
            value={formData.warranty_id}
            onChange={(e) => setFormData({ ...formData, warranty_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select</option>
            {warranties.map((w) => <option key={w.id} value={w.id}>{w.warranty_number}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {['SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','COMPLETED'].map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Problem</label>
        <textarea
          value={formData.problem}
          onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
        <textarea
          value={formData.diagnosis}
          onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
        <textarea
          value={formData.resolution}
          onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
        <input
          type="number"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
          {saving ? 'Saving...' : claim ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
