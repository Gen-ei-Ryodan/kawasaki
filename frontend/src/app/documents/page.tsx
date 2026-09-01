'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';

export default function VehicleDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {
    try {
      const response = await api.get('/vehicles', { params: { per_page: 100 } });
      setDocuments(response.data.data.data || []);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDocuments(); }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Documents</h1>
      <p className="text-gray-600 text-sm mb-6">Manage STNK, BPKB, invoices, and other vehicle documents</p>
      
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">VIN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Plate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Odometer</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((v: any) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{v.vehicle_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">{v.vin}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{v.license_plate || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      v.status === 'IN_STOCK' ? 'bg-blue-100 text-blue-800' :
                      v.status === 'SOLD' ? 'bg-green-100 text-green-800' :
                      v.status === 'DELIVERED' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{v.odometer} KM</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}