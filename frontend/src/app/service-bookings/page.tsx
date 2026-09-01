'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { Vehicle, Customer, Dealer } from '@/types';

export default function ServiceBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadData = async () => {
    try {
      const params: any = { per_page: 50 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const response = await api.get('/service-bookings', { params });
      setBookings(response.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [search, statusFilter]);

  const statusColors: Record<string, string> = {
    REQUESTED: 'bg-yellow-100 text-yellow-800', CONFIRMED: 'bg-blue-100 text-blue-800',
    ARRIVED: 'bg-purple-100 text-purple-800', IN_PROGRESS: 'bg-orange-100 text-orange-800',
    COMPLETED: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800',
    NO_SHOW: 'bg-gray-100 text-gray-800',
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Service Booking</h1>
          <p className="text-gray-600 text-sm">Manage service bookings and appointments</p>
        </div>
        <button
          onClick={() => { window.location.href = '/service-bookings/create'; }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          + New Booking
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search booking number..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
        >
          <option value="">All Status</option>
          <option value="REQUESTED">Requested</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="ARRIVED">Arrived</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NO_SHOW">No Show</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.booking_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{b.vehicle_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{b.booking_date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{b.service_type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => { window.location.href = '/service-bookings/' + b.id; }} className="text-blue-600 hover:text-blue-900">View</button>
                    <button onClick={() => { window.location.href = '/service-bookings/' + b.id + '/edit'; }} className="text-yellow-600 hover:text-yellow-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}