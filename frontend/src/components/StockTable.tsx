'use client';

interface StockItem {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  quantity: number;
  updated_at: string;
}

interface StockTableProps {
  stock: StockItem[];
}

export default function StockTable({ stock }: StockTableProps) {
  if (stock.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No stock records found</p>
      </div>
    );
  }

  const getLevelColor = (quantity: number) => {
    if (quantity === 0) return 'bg-red-100 text-red-800';
    if (quantity < 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {stock.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{item.sku}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(item.quantity)}`}>
                  {item.quantity}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(item.updated_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
