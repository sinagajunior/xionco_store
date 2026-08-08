'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SalesTable from '@/components/SalesTable';
import { salesApi } from '@/lib/api';

export default function SalesPage() {
  const { data: session } = useSession();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = (session as any)?.accessToken;
        const response = await salesApi.getAll(token);
        setSales(response.data);
      } catch (error) {
        console.error('Failed to fetch sales:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchSales();
    }
  }, [session]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sales</h1>
      <SalesTable sales={sales} />
    </div>
  );
}
