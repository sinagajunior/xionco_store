'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import StockTable from '@/components/StockTable';
import { stockApi, productApi } from '@/lib/api';

const ITEMS_PER_PAGE = 5;

export default function StockPage() {
  const { data: session } = useSession();
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    product_id: '',
    movement_type: 'IN',
    quantity: '',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = (session as any)?.accessToken;
        const [stockRes, productsRes] = await Promise.all([
          stockApi.getAll(token),
          productApi.getAll(token),
        ]);
        setStock(stockRes.data);
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

  const handleRecordMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = (session as any)?.accessToken;
      if (!token) {
        alert('No authentication token found');
        return;
      }

      await stockApi.recordMovement(
        {
          productId: parseInt(formData.product_id),
          movementType: formData.movement_type,
          quantity: parseInt(formData.quantity),
          notes: formData.notes,
        },
        token
      );

      setShowForm(false);
      setFormData({
        product_id: '',
        movement_type: 'IN',
        quantity: '',
        notes: '',
      });

      // Refresh stock
      const response = await stockApi.getAll(token);
      setStock(response.data);
      alert('Stock movement recorded successfully!');
    } catch (error) {
      console.error('Failed to record movement:', error);
      alert('Failed to record movement: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  const totalPages = Math.ceil(stock.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStock = stock.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stock Levels</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Record Movement'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleRecordMovement} className="bg-white rounded-lg shadow p-6 mb-8">
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
            <select
              value={formData.movement_type}
              onChange={(e) => setFormData({ ...formData, movement_type: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <div></div>
          </div>
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="border rounded px-3 py-2 w-full mt-4"
          />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-indigo-700">
            Record Movement
          </button>
        </form>
      )}

      <StockTable stock={paginatedStock} />

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
