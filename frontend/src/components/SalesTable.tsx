'use client';

interface Sale {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  sale_date: string;
}

interface SalesTableProps {
  sales: Sale[];
}

export default function SalesTable({ sales }: SalesTableProps) {
  if (sales.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No sales records found</p>
      </div>
    );
  }

  const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total_price), 0);

  return (
    <div>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Unit Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{sale.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{sale.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{sale.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${sale.unit_price}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">${sale.total_price}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(sale.sale_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
