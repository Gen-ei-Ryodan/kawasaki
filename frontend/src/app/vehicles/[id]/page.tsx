'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';

export default function VehicleDetailPage() {
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/vehicles/${id}/360`);
        setVehicle(response.data.data);
      } catch (err) {
        console.error('Failed to load:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <Layout><div className="text-center py-10">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehicle 360</h1>
          <p className="text-gray-600 text-sm">{vehicle?.vehicle_code} - {vehicle?.vin}</p>
        </div>
        <button
          onClick={() => { window.location.href = "/vehicles/" + id + "/edit"; }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Identity</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">VIN:</span> <span className="font-medium text-gray-800">{vehicle?.vin}</span></div>
            <div><span className="text-gray-500">Engine:</span> <span className="font-medium text-gray-800">{vehicle?.engine_number}</span></div>
            <div><span className="text-gray-500">Model:</span> <span className="font-medium text-gray-800">{vehicle?.model?.brand} {vehicle?.model?.model}</span></div>
            <div><span className="text-gray-500">Color:</span> <span className="font-medium text-gray-800">{vehicle?.color}</span></div>
            <div><span className="text-gray-500">Plate:</span> <span className="font-medium text-gray-800">{vehicle?.license_plate || '-'}</span></div>
            <div><span className="text-gray-500">KM:</span> <span className="font-medium text-gray-800">{vehicle?.odometer}</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Current Owner</h2>
          {vehicle?.currentOwner ? (
            <div className="text-sm">
              <p className="font-medium text-gray-800">{vehicle.currentOwner.customer?.full_name}</p>
              <p className="text-gray-500">Phone: {vehicle.currentOwner.customer?.phone}</p>
              <p className="text-gray-500">Since: {vehicle.currentOwner.ownership_start}</p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No current owner</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Service Summary</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Total Services:</span> <span className="font-medium text-gray-800">{vehicle?.stats?.total_services}</span></div>
            <div><span className="text-gray-500">Total Cost:</span> <span className="font-medium text-gray-800">Rp{vehicle?.stats?.total_service_cost?.toLocaleString('id-ID')}</span></div>
            <div><span className="text-gray-500">Last Service:</span> <span className="font-medium text-gray-800">{vehicle?.stats?.last_service?.service_date || '-'}</span></div>
            <div><span className="text-gray-500">Warranty Claims:</span> <span className="font-medium text-gray-800">{vehicle?.stats?.warranty_claims}</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Warranty</h2>
          {vehicle?.stats?.warranty ? (
            <div className="text-sm">
              <p className="font-medium text-gray-800">{vehicle.stats.warranty.warranty_number}</p>
              <p className="text-gray-500">Status: {vehicle.stats.warranty.status}</p>
              <p className="text-gray-500">End: {vehicle.stats.warranty.end_date}</p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No active warranty</p>
          )}
        </div>
      </div>
    </Layout>
  );
}