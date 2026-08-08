import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductTable from '@/components/ProductTable';

describe('ProductTable', () => {
  test('renders empty state when no products', () => {
    render(<ProductTable products={[]} />);
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  test('renders product rows', () => {
    const products = [
      {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        category: 'Test',
        price: '99.99',
        sku: 'TEST-001',
        created_at: '2024-01-01T00:00:00Z',
      },
    ];

    render(<ProductTable products={products} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  test('renders all product columns', () => {
    const products = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        category: 'Category 1',
        price: '49.99',
        sku: 'SKU-001',
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        category: 'Category 2',
        price: '79.99',
        sku: 'SKU-002',
        created_at: '2024-01-02T00:00:00Z',
      },
    ];

    render(<ProductTable products={products} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('SKU')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  test('displays correct price formatting', () => {
    const products = [
      {
        id: 1,
        name: 'Expensive Product',
        description: 'High price item',
        category: 'Premium',
        price: '1299.99',
        sku: 'PREMIUM-001',
        created_at: '2024-01-01T00:00:00Z',
      },
    ];

    render(<ProductTable products={products} />);
    expect(screen.getByText('$1299.99')).toBeInTheDocument();
  });
});
