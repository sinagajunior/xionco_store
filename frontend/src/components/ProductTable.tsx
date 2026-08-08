'use client';

const formatIDR = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numValue);
};

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  sku: string;
  created_at: string;
}

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
            {(onEdit || onDelete) && <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{formatIDR(product.price)}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{product.description}</td>
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 text-sm space-x-2 flex">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
