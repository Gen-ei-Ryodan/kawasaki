'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { ServiceRecord } from '@/types';

export default function ServiceDetailPage() {
  const [service, setService] = useState<ServiceRecord | any>(null);
  const [loading, setLoading] = useState(true);
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/services/${id}`);
        setService(response.data.data);
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
          <h1 className="text-2xl font-bold text-gray-800">Service Detail</h1>
          <p className="text-gray-600 text-sm">{service?.service_number}</p>
        </div>
        <button
          onClick={() => { window.location.href = "/services/" + id + "/edit"; }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          Edit
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Vehicle:</span> <span className="font-medium text-gray-800">{service?.vehicle?.vin || '-'}</span></div>
          <div><span className="text-gray-500">Date:</span> <span className="font-medium text-gray-800">{service?.service_date}</span></div>
          <div><span className="text-gray-500">Type:</span> <span className="font-medium text-gray-800">{service?.service_type}</span></div>
          <div><span className="text-gray-500">KM:</span> <span className="font-medium text-gray-800">{service?.odometer || '-'}</span></div>
          <div><span className="text-gray-500">Cost:</span> <span className="font-medium text-gray-800">Rp{service?.total_cost?.toLocaleString('id-ID')}</span></div>
          <div><span className="text-gray-500">Status:</span> <span className="font-medium text-gray-800">{service?.status}</span></div>
          {service?.complaint && <div className="col-span-2"><span className="text-gray-500">Complaint:</span> <span className="font-medium text-gray-800">{service.complaint}</span></div>}
          {service?.diagnosis && <div className="col-span-2"><span className="text-gray-500">Diagnosis:</span> <span className="font-medium text-gray-800">{service.diagnosis}</span></div>}
        </div>
      </div>
    </Layout>
  );
}