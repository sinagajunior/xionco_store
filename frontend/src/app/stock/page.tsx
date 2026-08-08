'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import StockTable from '@/components/StockTable';
import { stockApi } from '@/lib/api';

export default function StockPage() {
  const { data: session } = useSession();
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const token = (session as any)?.accessToken;
        const response = await stockApi.getAll(token);
        setStock(response.data);
      } catch (error) {
        console.error('Failed to fetch stock:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchStock();
    }
  }, [session]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Stock Levels</h1>
      <StockTable stock={stock} />
    </div>
  );
}
