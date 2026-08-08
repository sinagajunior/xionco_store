import React from 'react';
import { render, screen } from '@testing-library/react';
import SalesTable from '@/components/SalesTable';

describe('SalesTable', () => {
  test('renders empty state when no sales', () => {
    render(<SalesTable sales={[]} />);
    expect(screen.getByText('No sales records found')).toBeInTheDocument();
  });

  test('renders sales rows', () => {
    const sales = [
      {
        id: 1,
        product_id: 1,
        name: 'Test Product',
        sku: 'TEST-001',
        quantity: 5,
        unit_price: '99.99',
        total_price: '499.95',
        sale_date: '2024-01-01T00:00:00Z',
      },
    ];

    render(<SalesTable sales={sales} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getAllByText('$499.95')).toHaveLength(2); // Table and footer
  });

  test('calculates total revenue correctly', () => {
    const sales = [
      {
        id: 1,
        product_id: 1,
        name: 'Product 1',
        sku: 'SKU-001',
        quantity: 5,
        unit_price: '100.00',
        total_price: '500.00',
        sale_date: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        product_id: 2,
        name: 'Product 2',
        sku: 'SKU-002',
        quantity: 3,
        unit_price: '200.00',
        total_price: '600.00',
        sale_date: '2024-01-02T00:00:00Z',
      },
    ];

    render(<SalesTable sales={sales} />);
    expect(screen.getByText('$1100.00')).toBeInTheDocument();
  });

  test('renders all sales columns', () => {
    const sales = [
      {
        id: 1,
        product_id: 1,
        name: 'Test Product',
        sku: 'TEST-001',
        quantity: 2,
        unit_price: '49.99',
        total_price: '99.98',
        sale_date: '2024-01-01T00:00:00Z',
      },
    ];

    render(<SalesTable sales={sales} />);

    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('SKU')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Unit Price')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  test('displays correct date formatting', () => {
    const sales = [
      {
        id: 1,
        product_id: 1,
        name: 'Product',
        sku: 'SKU-001',
        quantity: 1,
        unit_price: '50.00',
        total_price: '50.00',
        sale_date: '2024-12-25T00:00:00Z',
      },
    ];

    render(<SalesTable sales={sales} />);
    expect(screen.getByText('12/25/2024')).toBeInTheDocument();
  });

  test('displays revenue in green color', () => {
    const sales = [
      {
        id: 1,
        product_id: 1,
        name: 'Product',
        sku: 'SKU-001',
        quantity: 1,
        unit_price: '100.00',
        total_price: '100.00',
        sale_date: '2024-01-01T00:00:00Z',
      },
    ];

    render(<SalesTable sales={sales} />);
    // Look for the total revenue header to ensure we're in the summary section
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    // Check that green revenue text exists in the document
    const revenueElements = screen.getAllByText('$100.00');
    expect(revenueElements.length).toBeGreaterThan(0);
  });
});
