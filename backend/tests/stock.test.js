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

describe('Stock API', () => {
  beforeAll(async () => {
    // Create a test product
    const product = {
      name: 'Stock Test Product',
      description: 'For stock tests',
      category: 'Test',
      price: 99.99,
      sku: `STOCK-${Date.now()}`
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(product);

    testProductId = response.body.id;
  });

  test('GET /api/stock should return stock levels', async () => {
    const response = await request(app)
      .get('/api/stock')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/stock/movement should record stock movement', async () => {
    const movement = {
      productId: testProductId,
      movementType: 'IN',
      quantity: 50,
      notes: 'Test stock in'
    };

    const response = await request(app)
      .post('/api/stock/movement')
      .set('Authorization', `Bearer ${token}`)
      .send(movement);

    expect(response.status).toBe(201);
    expect(response.body.quantity).toBe(50);
  });

  test('POST /api/stock/movement should fail with invalid movement type', async () => {
    const movement = {
      productId: testProductId,
      movementType: 'INVALID',
      quantity: 10,
      notes: 'Invalid'
    };

    const response = await request(app)
      .post('/api/stock/movement')
      .set('Authorization', `Bearer ${token}`)
      .send(movement);

    expect(response.status).toBe(400);
  });

  test('POST /api/stock/movement OUT should decrease quantity', async () => {
    const outMovement = {
      productId: testProductId,
      movementType: 'OUT',
      quantity: 10,
      notes: 'Test stock out'
    };

    const response = await request(app)
      .post('/api/stock/movement')
      .set('Authorization', `Bearer ${token}`)
      .send(outMovement);

    expect(response.status).toBe(201);
  });

  test('GET /api/stock/movements should return movement history', async () => {
    const response = await request(app)
      .get('/api/stock/movements')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/stock/product/:productId should return product stock', async () => {
    const response = await request(app)
      .get(`/api/stock/product/${testProductId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.product_id).toBe(testProductId);
  });
});
