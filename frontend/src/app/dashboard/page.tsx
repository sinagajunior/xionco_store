'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { productApi, stockApi, salesApi } from '@/lib/api';

interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  stockValue: number;
  totalSales: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalStock: 0,
    stockValue: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = (session as any)?.accessToken;

        const [productsRes, stockRes, salesRes] = await Promise.all([
          productApi.getAll(token),
          stockApi.getAll(token),
          salesApi.getSummary(token),
        ]);

        const products = productsRes.data;
        const stocks = stockRes.data;
        const sales = salesRes.data;

        const totalStock = stocks.reduce((sum: number, s: any) => sum + s.quantity, 0);
        const stockValue = stocks.reduce((sum: number, s: any) => {
          const product = products.find((p: any) => p.id === s.product_id);
          return sum + (s.quantity * (product?.price || 0));
        }, 0);

        setStats({
          totalProducts: products.length,
          totalStock,
          stockValue,
          totalSales: sales.totalSales || 0,
          totalRevenue: sales.totalRevenue || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="Total Stock Items" value={stats.totalStock} />
        <StatCard title="Stock Value" value={`$${stats.stockValue.toFixed(2)}`} />
        <StatCard title="Total Sales" value={stats.totalSales} />
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-gray-600 text-sm font-medium">{title}</h2>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}
