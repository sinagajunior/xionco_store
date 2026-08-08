'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SalesTable from '@/components/SalesTable';
import { salesApi, productApi } from '@/lib/api';

const ITEMS_PER_PAGE = 5;

export default function SalesPage() {
  const { data: session } = useSession();
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
          productId: parseInt(formData.product_id),
          quantity: parseInt(formData.quantity),
          unitPrice: parseFloat(formData.unit_price),
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

  const totalPages = Math.ceil(sales.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSales = sales.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
            <div>
              <input
                type="number"
                placeholder="Unit Price (IDR)"
                step="1"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />
              <small className="text-gray-500">Price per unit in Indonesian Rupiah</small>
            </div>
            <div></div>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-indigo-700">
            Record Sale
          </button>
        </form>
      )}

      <SalesTable sales={paginatedSales} />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded border disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mx-4">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
