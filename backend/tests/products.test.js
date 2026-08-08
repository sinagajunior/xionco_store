const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/database');
const jwt = require('jsonwebtoken');

let token;

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

describe('Products API', () => {
  test('GET /api/products should return array of products', async () => {
    const response = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/products should create a product', async () => {
    const product = {
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test',
      price: 99.99,
      sku: `TEST-${Date.now()}`
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(product);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(product.name);
    expect(response.body.price).toBe('99.99');
  });

  test('POST /api/products should fail without required fields', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test' });

    expect(response.status).toBe(400);
  });

  test('GET /api/products/:id should return product by ID', async () => {
    // First create a product
    const product = {
      name: 'Test Product 2',
      description: 'Test Description',
      category: 'Test',
      price: 49.99,
      sku: `TEST2-${Date.now()}`
    };

    const createResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(product);

    const productId = createResponse.body.id;

    // Now fetch it
    const response = await request(app)
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
  });

  test('PUT /api/products/:id should update a product', async () => {
    const product = {
      name: 'Original Product',
      description: 'Original',
      category: 'Test',
      price: 100,
      sku: `UPDATE-${Date.now()}`
    };

    const createResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(product);

    const productId = createResponse.body.id;

    const updateData = {
      name: 'Updated Product',
      description: 'Updated Description',
      category: 'Updated',
      price: 150,
      sku: `UPDATE-${Date.now()}`
    };

    const response = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Product');
    expect(response.body.price).toBe('150.00');
  });

  test('DELETE /api/products/:id should delete a product', async () => {
    const product = {
      name: 'Delete Test Product',
      description: 'To be deleted',
      category: 'Test',
      price: 50,
      sku: `DELETE-${Date.now()}`
    };

    const createResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(product);

    const productId = createResponse.body.id;

    const response = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    // Verify deletion
    const getResponse = await request(app)
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).toBe(404);
  });
});
