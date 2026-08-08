const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/database');
const jwt = require('jsonwebtoken');

let token;
let testProductId;

beforeAll(() => {
  token = jwt.sign(
    { id: 1, email: 'test@example.com', name: 'Test User' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
});

afterAll(async () => {
  await pool.end();
});

describe('Sales API', () => {
  beforeAll(async () => {
    // Create a test product
    const product = {
      name: 'Sales Test Product',
      description: 'For sales tests',
      category: 'Test',
      price: 99.99,
      sku: `SALES-${Date.now()}`
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(product);

    testProductId = response.body.id;

    // Add stock
    const stockMovement = {
      productId: testProductId,
      movementType: 'IN',
      quantity: 100,
      notes: 'Initial stock'
    };

    await request(app)
      .post('/api/stock/movement')
      .set('Authorization', `Bearer ${token}`)
      .send(stockMovement);
  });

  test('GET /api/sales should return array of sales', async () => {
    const response = await request(app)
      .get('/api/sales')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/sales should create a sale', async () => {
    const sale = {
      productId: testProductId,
      quantity: 5,
      unitPrice: 99.99
    };

    const response = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${token}`)
      .send(sale);

    expect(response.status).toBe(201);
    expect(response.body.quantity).toBe(5);
    expect(response.body.unit_price).toBe('99.99');
    expect(response.body.total_price).toBe('499.95');
  });

  test('POST /api/sales should fail with insufficient stock', async () => {
    const sale = {
      productId: testProductId,
      quantity: 1000,
      unitPrice: 99.99
    };

    const response = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${token}`)
      .send(sale);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Insufficient stock');
  });

  test('POST /api/sales should fail with missing fields', async () => {
    const sale = {
      productId: testProductId,
      quantity: 5
    };

    const response = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${token}`)
      .send(sale);

    expect(response.status).toBe(400);
  });

  test('GET /api/sales/summary should return sales summary', async () => {
    const response = await request(app)
      .get('/api/sales/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(typeof response.body.totalSales).toBe('number');
    expect(typeof response.body.totalUnitsSold).toBe('number');
    expect(typeof response.body.totalRevenue).toBe('number');
  });

  test('GET /api/sales/:id should return sale by ID', async () => {
    // Create a sale
    const sale = {
      productId: testProductId,
      quantity: 3,
      unitPrice: 99.99
    };

    const createResponse = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${token}`)
      .send(sale);

    const saleId = createResponse.body.id;

    // Fetch it
    const response = await request(app)
      .get(`/api/sales/${saleId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(saleId);
  });
});
