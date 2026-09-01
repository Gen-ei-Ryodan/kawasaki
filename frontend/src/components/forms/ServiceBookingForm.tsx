'use client';

import { useState, type ReactElement } from 'react';
import { ServiceBooking, Vehicle, Customer, Dealer } from '@/types';

interface ServiceBookingFormProps {
  booking: ServiceBooking | null;
  onSave: (data: Partial<ServiceBooking>) => void;
  onClose: () => void;
  saving?: boolean;
  vehicles?: Vehicle[];
  customers?: Customer[];
  dealers?: Dealer[];
}

export default function ServiceBookingForm({ booking, onSave, onClose, saving, vehicles = [], customers = [], dealers = [] }: ServiceBookingFormProps): ReactElement {
  const [formData, setFormData] = useState({
    vehicle_id: booking?.vehicle_id ? String(booking.vehicle_id) : '',
    customer_id: booking?.customer_id ? String(booking.customer_id) : '',
    dealer_id: booking?.dealer_id ? String(booking.dealer_id) : '',
    booking_date: booking?.booking_date || '',
    booking_time: booking?.booking_time || '',
    service_type: booking?.service_type || 'ROUTINE',
    complaint: booking?.complaint || '',
    assigned_advisor_id: booking?.assigned_advisor_id ? String(booking.assigned_advisor_id) : '',
    status: booking?.status || 'REQUESTED',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<ServiceBooking> = {
      vehicle_id: Number(formData.vehicle_id),
      customer_id: formData.customer_id ? Number(formData.customer_id) : null,
      dealer_id: formData.dealer_id ? Number(formData.dealer_id) : null,
      booking_date: formData.booking_date,
      booking_time: formData.booking_time || null,
      service_type: formData.service_type,
      complaint: formData.complaint || null,
      assigned_advisor_id: formData.assigned_advisor_id ? Number(formData.assigned_advisor_id) : null,
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
          <input
            type="date"
            value={formData.booking_date}
            onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Booking Time</label>
          <input
            type="time"
            value={formData.booking_time}
            onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {['REQUESTED','CONFIRMED','ARRIVED','IN_PROGRESS','COMPLETED','CANCELLED','NO_SHOW'].map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
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
          {saving ? 'Saving...' : booking ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
