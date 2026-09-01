'use client';

import { useState, type ReactElement } from 'react';
import { ServiceRecord, Vehicle, Customer, Dealer } from '@/types';

interface ServiceFormProps {
  service: ServiceRecord | null;
  onSave: (data: Partial<ServiceRecord>) => void;
  onClose: () => void;
  saving?: boolean;
  vehicles?: Vehicle[];
  customers?: Customer[];
  dealers?: Dealer[];
}

export default function ServiceForm({ service, onSave, onClose, saving, vehicles = [], customers = [], dealers = [] }: ServiceFormProps): ReactElement {
  const [formData, setFormData] = useState({
    vehicle_id: service?.vehicle_id ? String(service.vehicle_id) : '',
    customer_id: service?.customer_id ? String(service.customer_id) : '',
    dealer_id: service?.dealer_id ? String(service.dealer_id) : '',
    service_date: service?.service_date || '',
    odometer: service?.odometer ? String(service.odometer) : '',
    service_type: service?.service_type || 'ROUTINE',
    complaint: service?.complaint || '',
    diagnosis: service?.diagnosis || '',
    notes: service?.notes || '',
    total_cost: service?.total_cost ? String(service.total_cost) : '',
    status: service?.status || 'PENDING',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<ServiceRecord> = {
      vehicle_id: Number(formData.vehicle_id),
      customer_id: formData.customer_id ? Number(formData.customer_id) : null,
      dealer_id: formData.dealer_id ? Number(formData.dealer_id) : null,
      service_date: formData.service_date,
      odometer: Number(formData.odometer) || null,
      service_type: formData.service_type,
      complaint: formData.complaint || null,
      diagnosis: formData.diagnosis || null,
      notes: formData.notes || null,
      total_cost: Number(formData.total_cost) || 0,
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Date</label>
          <input
            type="date"
            value={formData.service_date}
            onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
          <select
            value={formData.service_type}
            onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {['ROUTINE','PERIODIC','REPAIR','WARRANTY','INSPECTION','OTHER'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Odometer (KM)</label>
          <input
            type="number"
            value={formData.odometer}
            onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
          <input
            type="number"
            value={formData.total_cost}
            onChange={(e) => setFormData({ ...formData, total_cost: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Complaint</label>
        <textarea
          value={formData.complaint}
          onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
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
          {saving ? 'Saving...' : service ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
