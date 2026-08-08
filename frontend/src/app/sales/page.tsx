'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SalesTable from '@/components/SalesTable';
import { salesApi, productApi } from '@/lib/api';

export default function SalesPage() {
  const { data: session } = useSession();
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    unit_price: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = (session as any)?.accessToken;
        const [salesRes, productsRes] = await Promise.all([
          salesApi.getAll(token),
          productApi.getAll(token),
        ]);
        setSales(salesRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = (session as any)?.accessToken;
      if (!token) {
        alert('No authentication token found');
        return;
      }

      await salesApi.create(
        {
          product_id: parseInt(formData.product_id),
          quantity: parseInt(formData.quantity),
          unit_price: parseFloat(formData.unit_price),
        },
        token
      );

      setShowForm(false);
      setFormData({
        product_id: '',
        quantity: '',
        unit_price: '',
      });

      // Refresh sales
      const response = await salesApi.getAll(token);
      setSales(response.data);
      alert('Sale recorded successfully!');
    } catch (error) {
      console.error('Failed to add sale:', error);
      alert('Failed to add sale: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Record Sale'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddSale} className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Unit Price"
              step="0.01"
              value={formData.unit_price}
              onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <div></div>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-indigo-700">
            Record Sale
          </button>
        </form>
      )}

      <SalesTable sales={sales} />
    </div>
  );
}
