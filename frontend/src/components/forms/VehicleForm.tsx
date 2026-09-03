'use client';

import { useState, type ReactElement } from 'react';
import { Vehicle, VehicleModel, Dealer } from '@/types';

interface VehicleFormProps {
  vehicle: Vehicle | null;
  onSave: (data: Partial<Vehicle>) => void;
  onClose: () => void;
  saving?: boolean;
  models?: VehicleModel[];
  dealers?: Dealer[];
}

export default function VehicleForm({ vehicle, onSave, onClose, saving, models = [], dealers = [] }: VehicleFormProps): ReactElement {
  const [formData, setFormData] = useState({
    vehicle_model_id: vehicle?.vehicle_model_id ? String(vehicle.vehicle_model_id) : '',
    vin: vehicle?.vin || '',
    engine_number: vehicle?.engine_number || '',
    color: vehicle?.color || '',
    year: vehicle?.year ? String(vehicle.year) : '',
    license_plate: vehicle?.license_plate || '',
    odometer: vehicle?.odometer ? String(vehicle.odometer) : '',
    dealer_id: vehicle?.dealer_id ? String(vehicle.dealer_id) : '',
    status: vehicle?.status || 'IN_STOCK',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      vehicle_model_id: Number(formData.vehicle_model_id),
      vin: formData.vin,
      engine_number: formData.engine_number,
      color: formData.color || null,
      year: Number(formData.year) || null,
      license_plate: formData.license_plate || null,
      odometer: Number(formData.odometer) || 0,
      dealer_id: formData.dealer_id ? Number(formData.dealer_id) : null,
      status: formData.status,
    };
    onSave(data as Partial<Vehicle>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <select
            value={formData.vehicle_model_id}
            onChange={(e) => setFormData({ ...formData, vehicle_model_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
            required
          >
            <option value="">Select Model</option>
            {models.map((m) => <option key={m.id} value={m.id}>{m.brand} {m.model} {m.variant || ''}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          >
            {['IN_STOCK','BOOKED','SOLD','DELIVERED','IN_SERVICE','TRANSFERRED','SCRAPPED'].map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
          <input
            type="text"
            value={formData.vin}
            onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
          <input
            type="text"
            value={formData.engine_number}
            onChange={(e) => setFormData({ ...formData, engine_number: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
          <input
            type="text"
            value={formData.license_plate}
            onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Odometer (KM)</label>
          <input
            type="number"
            value={formData.odometer}
            onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dealer</label>
          <select
            value={formData.dealer_id}
            onChange={(e) => setFormData({ ...formData, dealer_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          >
            <option value="">Select Dealer</option>
            {dealers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
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
          {saving ? 'Saving...' : vehicle ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
