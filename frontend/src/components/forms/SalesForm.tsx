'use client';

import { useState, type ReactElement } from 'react';
import { SalesTransaction, Customer, Vehicle, Salesperson, Dealer } from '@/types';

interface SalesFormProps {
  sale: SalesTransaction | null;
  onSave: (data: Partial<SalesTransaction>) => void;
  onClose: () => void;
  saving?: boolean;
  customers?: Customer[];
  vehicles?: Vehicle[];
  salespersons?: Salesperson[];
  dealers?: Dealer[];
}

export default function SalesForm({ sale, onSave, onClose, saving, customers = [], vehicles = [], salespersons = [], dealers = [] }: SalesFormProps): ReactElement {
  const [formData, setFormData] = useState({
    customer_id: sale?.customer_id ? String(sale.customer_id) : '',
    vehicle_id: sale?.vehicle_id ? String(sale.vehicle_id) : '',
    salesperson_id: sale?.salesperson_id ? String(sale.salesperson_id) : '',
    dealer_id: sale?.dealer_id ? String(sale.dealer_id) : '',
    sale_date: sale?.sale_date || '',
    vehicle_price: sale?.vehicle_price ? String(sale.vehicle_price) : '',
    discount: sale?.discount ? String(sale.discount) : '',
    additional_cost: sale?.additional_cost ? String(sale.additional_cost) : '',
    payment_method: sale?.payment_method || '',
    payment_status: sale?.payment_status || 'UNPAID',
    status: sale?.status || 'DRAFT',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<SalesTransaction> = {
      customer_id: formData.customer_id ? Number(formData.customer_id) : null,
      vehicle_id: formData.vehicle_id ? Number(formData.vehicle_id) : null,
      salesperson_id: formData.salesperson_id ? Number(formData.salesperson_id) : null,
      dealer_id: formData.dealer_id ? Number(formData.dealer_id) : null,
      sale_date: formData.sale_date || null,
      vehicle_price: Number(formData.vehicle_price) || 0,
      discount: Number(formData.discount) || 0,
      additional_cost: Number(formData.additional_cost) || 0,
      payment_method: formData.payment_method || null,
      payment_status: formData.payment_status,
      status: formData.status,
    };
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <select
            value={formData.customer_id}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          >
            <option value="">Select Customer</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
          <select
            value={formData.vehicle_id}
            onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.vin} ({v.color})</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson</label>
          <select
            value={formData.salesperson_id}
            onChange={(e) => setFormData({ ...formData, salesperson_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          >
            <option value="">Select</option>
            {salespersons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Sale Date</label>
          <input
            type="date"
            value={formData.sale_date}
            onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Price</label>
          <input
            type="number"
            value={formData.vehicle_price}
            onChange={(e) => setFormData({ ...formData, vehicle_price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
          <input
            type="number"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Cost</label>
          <input
            type="number"
            value={formData.additional_cost}
            onChange={(e) => setFormData({ ...formData, additional_cost: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select
            value={formData.payment_method}
            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          >
            <option value="">Select</option>
            <option value="CASH">Cash</option>
            <option value="CREDIT">Credit</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
          <select
            value={formData.payment_status}
            onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
          >
            <option value="UNPAID">Unpaid</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
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
          {saving ? 'Saving...' : sale ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
