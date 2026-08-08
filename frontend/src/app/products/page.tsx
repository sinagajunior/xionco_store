'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ProductTable from '@/components/ProductTable';
import { productApi } from '@/lib/api';

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', category: '', price: '', sku: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = (session as any)?.accessToken;
        if (!token) {
          console.log('Waiting for accessToken...', { session, status });
          return;
        }
        const response = await productApi.getAll(token);
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session && status === 'authenticated') {
      fetchProducts();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = (session as any)?.accessToken;
      console.log('Add product - Session:', { session, status, token: token ? 'exists' : 'missing' });

      if (!token) {
        alert('Authentication token not available. Please ensure you are logged in.');
        setSubmitting(false);
        return;
      }

      const response = await productApi.create({
        ...formData,
        price: parseFloat(formData.price),
      }, token);

      if (response.status === 201 || response.status === 200) {
        setShowForm(false);
        setFormData({ name: '', description: '', category: '', price: '', sku: '' });
        // Refresh products
        const productsResponse = await productApi.getAll(token);
        setProducts(productsResponse.data);
        alert('Product added successfully!');
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddProduct} className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="border rounded px-3 py-2"
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border rounded px-3 py-2 w-full mt-4"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {submitting ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      )}

      <ProductTable products={products} />
    </div>
  );
}
