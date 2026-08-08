'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ProductTable from '@/components/ProductTable';
import Alert from '@/components/Alert';
import ConfirmDialog from '@/components/ConfirmDialog';
import { productApi } from '@/lib/api';

const ITEMS_PER_PAGE = 5;

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '', category: '', price: '', sku: '' });
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

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

      if (editingId) {
        // Update product
        await productApi.update(editingId, {
          ...formData,
          price: parseFloat(formData.price),
        }, token);
        setAlert({ message: 'Product updated successfully!', type: 'success' });
      } else {
        // Create product
        await productApi.create({
          ...formData,
          price: parseFloat(formData.price),
        }, token);
        setAlert({ message: 'Product added successfully!', type: 'success' });
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', category: '', price: '', sku: '' });
      setCurrentPage(1);

      // Refresh products
      const productsResponse = await productApi.getAll(token);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Failed to save product:', error);
      setAlert({
        message: 'Failed to save product: ' + (error instanceof Error ? error.message : 'Unknown error'),
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      sku: product.sku,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    setConfirmDelete(id);
  };

  const confirmDeleteProduct = async () => {
    if (confirmDelete === null) return;

    try {
      const token = (session as any)?.accessToken;
      if (!token) {
        setAlert({ message: 'Authentication token not available.', type: 'error' });
        setConfirmDelete(null);
        return;
      }

      await productApi.delete(confirmDelete, token);
      setAlert({ message: 'Product deleted successfully!', type: 'success' });

      // Refresh products
      const productsResponse = await productApi.getAll(token);
      setProducts(productsResponse.data);
      setCurrentPage(1);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      setAlert({
        message: 'Failed to delete product: ' + (error instanceof Error ? error.message : 'Unknown error'),
        type: 'error',
      });
      setConfirmDelete(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', category: '', price: '', sku: '' });
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', description: '', category: '', price: '', sku: '' });
            setShowForm(!showForm);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products by name, category, SKU, or description..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {showForm && (
        <form onSubmit={handleAddProduct} className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h2>
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
            <div>
              <input
                type="number"
                placeholder="Price (IDR)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />
              <small className="text-gray-500">Price in Indonesian Rupiah</small>
            </div>
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
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {submitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Product' : 'Add Product')}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg mt-4 hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ProductTable products={paginatedProducts} onEdit={handleEdit} onDelete={handleDelete} />

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {confirmDelete !== null && (
        <ConfirmDialog
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={confirmDeleteProduct}
          onCancel={() => setConfirmDelete(null)}
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous={true}
        />
      )}

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
