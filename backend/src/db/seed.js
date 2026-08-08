const pool = require('../config/database');
require('dotenv').config();

const products = [
  {
    name: 'Modern Sectional Sofa',
    description: 'Spacious L-shaped sectional sofa with premium upholstery',
    category: 'Living Room',
    price: 1299.99,
    sku: 'SOFA-001'
  },
  {
    name: 'Elegant Dining Table',
    description: 'Solid wood dining table with glass top, seats 8',
    category: 'Dining Room',
    price: 899.99,
    sku: 'TABLE-001'
  },
  {
    name: 'Queen Platform Bed Frame',
    description: 'Modern platform bed frame with storage drawers',
    category: 'Bedroom',
    price: 599.99,
    sku: 'BED-001'
  },
  {
    name: 'Industrial Bookshelf',
    description: 'Five-tier bookshelf with metal frame and wood shelves',
    category: 'Living Room',
    price: 349.99,
    sku: 'SHELF-001'
  },
  {
    name: 'Minimalist Coffee Table',
    description: 'Sleek coffee table with tempered glass top and metal base',
    category: 'Living Room',
    price: 249.99,
    sku: 'TABLE-002'
  },
  {
    name: 'Modern Wardrobe Cabinet',
    description: 'Spacious three-door wardrobe with interior organization',
    category: 'Bedroom',
    price: 749.99,
    sku: 'WARD-001'
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Adjustable desk chair with lumbar support and wheels',
    category: 'Office',
    price: 349.99,
    sku: 'CHAIR-001'
  },
  {
    name: 'Smart TV Stand',
    description: 'TV stand with built-in storage and cable management',
    category: 'Living Room',
    price: 279.99,
    sku: 'TVSTAND-001'
  },
  {
    name: 'Wooden Nightstand',
    description: 'Classic nightstand with two drawers and open shelf',
    category: 'Bedroom',
    price: 199.99,
    sku: 'NIGHT-001'
  },
  {
    name: 'Contemporary Dresser',
    description: 'Modern dresser with 6 drawers and full-length mirror',
    category: 'Bedroom',
    price: 549.99,
    sku: 'DRESS-001'
  }
];

const seedDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM sales');
    await client.query('DELETE FROM stock_movements');
    await client.query('DELETE FROM stock');
    await client.query('DELETE FROM products');

    // Insert products and create stock records
    for (const product of products) {
      const result = await client.query(
        `INSERT INTO products (name, description, category, price, sku)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [product.name, product.description, product.category, product.price, product.sku]
      );

      const productId = result.rows[0].id;

      // Create stock record with random initial quantity
      const quantity = Math.floor(Math.random() * 50) + 10;
      await client.query(
        `INSERT INTO stock (product_id, quantity)
         VALUES ($1, $2)`,
        [productId, quantity]
      );

      // Create initial stock movement record
      await client.query(
        `INSERT INTO stock_movements (product_id, movement_type, quantity, notes)
         VALUES ($1, $2, $3, $4)`,
        [productId, 'IN', quantity, 'Initial stock']
      );
    }

    await client.query('COMMIT');
    console.log('✓ Database seeded successfully with 10 products');
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('✗ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
  }
};

seedDatabase();
